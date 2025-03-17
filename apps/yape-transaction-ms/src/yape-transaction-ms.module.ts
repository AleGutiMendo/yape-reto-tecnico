import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '@transaction/domain/entities/transaction.entity';
import { TransactionConsumer } from '@transaction/infrastructure/messaging/kafka/transaction.consumer';
import { TransactionProducer } from '@transaction/infrastructure/messaging/kafka/transaction.producer';
import { TransactionRepository } from '@transaction/infrastructure/repositories/transaction.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'transactions',
      entities: [TransactionEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([TransactionEntity]),
    ClientsModule.register([
      {
        name: 'KAFKA_CONSUMER',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
            retry: {
              initialRetryTime: 3000,
              retries: 10,
            },
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
        },
      },
      {
        name: 'KAFKA_PRODUCER',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
          },
          producerOnlyMode: true,
        },
      },
    ]),
  ],
  providers: [TransactionRepository, TransactionProducer, TransactionConsumer],
  exports: [TransactionRepository, TransactionProducer],
})
export class YapeTransactionMsModule {}
