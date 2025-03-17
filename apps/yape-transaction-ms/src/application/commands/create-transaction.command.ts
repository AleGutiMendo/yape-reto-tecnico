import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  TransactionEntity,
  TransactionStatus,
} from '@transaction/domain/entities/transaction.entity';
import { TransactionProducer } from '@transaction/infrastructure/messaging/kafka/transaction.producer';
import { TransactionRepository } from '@transaction/infrastructure/repositories/transaction.repository';
import { CreateTransactionDto } from '@transaction/interface/dtos/create-transaction.dto';

export class CreateTransactionCommand {
  constructor(public readonly dto: CreateTransactionDto) {}
}

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly transactionProducer: TransactionProducer,
  ) {}

  async execute(command: CreateTransactionCommand): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.create({
      ...command.dto,
      status: TransactionStatus.PENDING,
    });
    await this.transactionProducer.publishTransactionCreated(transaction);
    return transaction;
  }
}
