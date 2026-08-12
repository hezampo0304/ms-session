import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';

import { Kafka, Consumer } from 'kafkajs';


import { UserAuthenticatedEvent } from '../events/user-authenticated.event';
import { SessionService } from 'src/session/services/session.service';

@Injectable()
export class KafkaConsumerService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger =
    new Logger(KafkaConsumerService.name);

  private readonly kafka: Kafka;
  private readonly consumer: Consumer;

  constructor(
    private readonly sessionService: SessionService,
  ) {
    this.kafka = new Kafka({
      clientId: 'ms-session',

      brokers: [
        process.env.KAFKA_BROKER ?? 'localhost:9092',
      ],
    });

    this.consumer = this.kafka.consumer({
      groupId:
        process.env.KAFKA_GROUP_ID ??
        'ms-session-group',
    });
  }

  async onModuleInit(): Promise<void> {
    await this.consumer.connect();

    this.logger.log(
      'Kafka consumer connected',
    );

    await this.consumer.subscribe({
      topic:
        process.env.KAFKA_AUTH_EVENTS_TOPIC ??
        'auth.events',

      fromBeginning: false,
    });

    this.logger.log(
      `Subscribed to ${
        process.env.KAFKA_AUTH_EVENTS_TOPIC ??
        'auth.events'
      }`,
    );

    await this.consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
      }) => {
        if (!message.value) {
          return;
        }

        try {
          const event =
            JSON.parse(
              message.value.toString(),
            ) as UserAuthenticatedEvent;

          this.logger.log(
            `Event received: ${event.eventType}`,
          );

          this.logger.debug({
            topic,
            partition,
            event,
          });

          if (
            event.eventType !==
            'USER_AUTHENTICATED'
          ) {
            await this.sessionService.revokeSession(
    event.sessionId,
  );
  this.logger.log(
    `Session ${event.sessionId} revoked successfully`,
  );
            return;
          }

          

          if (
            !event.userId ||
            !event.tenantId ||
            !event.sessionId
          ) {
            this.logger.warn(
              'USER_AUTHENTICATED event missing required fields',
            );

            return;
          }

          /*
           * Kafka puede entregar un evento nuevamente.
           * Antes de crear la sesión verificamos si ya existe.
           */
          const existingSession =
            await this.sessionService.getSession(
              event.sessionId,
            );

          if (existingSession) {
            this.logger.log(
              `Session ${event.sessionId} already exists. Skipping.`,
            );

            return;
          }

          await this.sessionService.createSession({
            id: event.sessionId,
            userId: event.userId,
            tenantId: event.tenantId,
            email: event.email,
            firstName: event.firstName,
            lastName: event.lastName,
            displayName: event.displayName,
            phone: event.phone,
            ipAddress: event.ipAddress,
            userAgent: event.userAgent,
            expiresAt: new Date(
              event.expiresAt,
            ),
          });

          this.logger.log(
            `Session ${event.sessionId} created successfully`,
          );
        } catch (error) {
          this.logger.error(
            'Error processing Kafka event',
            error instanceof Error
              ? error.stack
              : String(error),
          );

          throw error;
        }
      },
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.consumer.disconnect();

    this.logger.log(
      'Kafka consumer disconnected',
    );
  }
}