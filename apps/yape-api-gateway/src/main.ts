import { NestFactory } from '@nestjs/core';
import { YapeApiGatewayModule } from './yape-api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(YapeApiGatewayModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
