import { NestFactory } from '@nestjs/core';
import { YapeAntiFraudMsModule } from './yape-anti-fraud-ms.module';

async function bootstrap() {
  const app = await NestFactory.create(YapeAntiFraudMsModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
