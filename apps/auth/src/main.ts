import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { MongoExceptionFilter } from '@app/shared/exception/mongo.exception-filter';
import { EntityToDtoInterceptor } from '@app/shared/exception/entity-to-dto.interceptor';
import { HttpToRpcExceptionFilter } from '@app/shared/exception/http-to-rpc.exception-filter';
import { LoggingInterceptor } from '@app/shared/exception/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      options: {
        debug: true,
        host: process.env.AUTH_SERVICE_HOST || '0.0.0.0',
        port: process.env.AUTH_SERVICE_PORT || 3002,
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(
    new MongoExceptionFilter(),
    new HttpToRpcExceptionFilter(),
  );
  app.useGlobalInterceptors(
    new EntityToDtoInterceptor(),
    new LoggingInterceptor(),
  );
  await app.listen();
}

bootstrap();
