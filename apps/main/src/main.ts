import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpToRpcExceptionFilter } from '@app/shared/exception/http-to-rpc.exception-filter';
import { RpcToHttpExceptionFilter } from '@app/shared/exception/rpc-to-http-exception.filter';
import { LoggingInterceptor } from '@app/shared/exception/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({ type: VersioningType.URI, prefix: 'api/v' });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(
    new HttpToRpcExceptionFilter(),
    new RpcToHttpExceptionFilter(),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());

  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    include: [AppModule],
  });
  SwaggerModule.setup('docs', app, document);

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
