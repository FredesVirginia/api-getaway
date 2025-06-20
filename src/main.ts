import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RpcExceptionFilter } from './RcpExeption/RcpExeption';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api")
  app.useGlobalFilters(new RpcExceptionFilter());
  await app.listen(process.env.PORT ?? 3010);
}
bootstrap();
