import { Inject, Injectable } from '@nestjs/common';
import {
  ClientKafka,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { TransactionRepository } from '@transaction/infrastructure/repositories/transaction.repository';
import { UpdateTransactionDto } from '@transaction/interface/dtos/update-transaction.dto';

@Injectable()
export class TransactionConsumer {
  constructor(
    @Inject('KAFKA_CONSUMER') private readonly kafkaClient: ClientKafka,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  @MessagePattern('transaction.status.updated')
  async handleTransactionStatusUpdated(
    @Payload() message: UpdateTransactionDto,
    context: KafkaContext,
  ) {
    console.log(`Received message: ${JSON.stringify(message)}`);
    const { id, status } = message;

    await this.transactionRepository.updateStatus(id, status);

    console.log(`Transaction ${id} updated to status ${status}`);
  }
}
