import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { UserModule } from './user.module';
import { ValidationPipe } from '@nestjs/common';
import { MongoExceptionFilter } from '@app/shared/exception/mongo.exception-filter';
import { HttpToRpcExceptionFilter } from '@app/shared/exception/http-to-rpc.exception-filter';
import { EntityToDtoInterceptor } from '@app/shared/exception/entity-to-dto.interceptor';
import { LoggingInterceptor } from '@app/shared/exception/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      options: {
        debug: true,
        host: process.env.USER_SERVICE_HOST || '0.0.0.0',
        port: process.env.USER_SERVICE_PORT || 3001,
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
