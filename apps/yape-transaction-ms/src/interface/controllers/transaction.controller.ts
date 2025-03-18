import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTransactionCommand } from '@transaction/application/commands/create-transaction.command';

@Controller()
export class TransactionController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern('transaction.request.create')
  async createTransaction(@Payload() message: any) {
    console.log(
      '📥 Recibiendo solicitud de transacción:',
      JSON.stringify(message, null, 2),
    );

    return this.commandBus.execute(new CreateTransactionCommand(message));
  }
}
