import { NestFactory } from '@nestjs/core';
import { YapeTransactionMsModule } from './yape-transaction-ms.module';

async function bootstrap() {
  const app = await NestFactory.create(YapeTransactionMsModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
