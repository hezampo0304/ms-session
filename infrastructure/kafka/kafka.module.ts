import { Global, Module } from '@nestjs/common';

import { KafkaConsumerService } from './kafka.consumer.service';
import { SessionModule } from 'src/session/session.module';

@Global()
@Module({
  imports: [
    SessionModule,
  ],
  
  providers: [
    KafkaConsumerService,
  ],

  exports: [
    KafkaConsumerService,
  ],
})
export class KafkaModule {}