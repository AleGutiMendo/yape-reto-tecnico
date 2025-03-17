import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionEntity } from '@transaction/domain/entities/transaction.entity';

@Injectable()
export class TransactionProducer {
  constructor(
    @Inject('KAFKA_PRODUCER') private readonly kafkaClient: ClientKafka,
  ) {}

  async publishTransactionCreated(transaction: TransactionEntity) {
    if (!this.kafkaClient || !this.kafkaClient['producer']) {
      console.error('Kafka Producer no está conectado.');
      return;
    }

    const payload = { ...transaction };

    console.log('Enviando mensaje a Kafka:', payload);

    try {
      await this.kafkaClient.emit('transaction.created', payload).toPromise();
      console.log(
        `Mensaje enviado a Kafka: transaction.created - ID ${transaction.id}`,
      );
    } catch (err) {
      console.error(`Error enviando mensaje a Kafka:`, err);
    }
  }
}
