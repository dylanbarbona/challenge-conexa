import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

import {
  USER_CLIENT,
  USER_SERVICE,
} from '@app/user/domain/contracts/user.service';
import {
  AUTH_CLIENT,
  AUTH_SERVICE,
} from '@app/auth/domain/contracts/auth.service';
import { UserController } from '@app/main/user/user.controller';
import { AuthController } from '@app/main/auth/auth.controller';
import { UserProxy } from '@app/user/infrastructure/external/user.proxy';
import { AuthProxy } from '@app/auth/infrastructure/external/auth.proxy';

import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.string().default(3000),
        USER_SERVICE_HOST: Joi.string().default('0.0.0.0'),
        USER_SERVICE_PORT: Joi.string().default(3001),
        AUTH_SERVICE_HOST: Joi.string().default('0.0.0.0'),
        AUTH_SERVICE_PORT: Joi.string().default(3002),
        MOVIE_SERVICE_HOST: Joi.string().default('0.0.0.0'),
        MOVIE_SERVICE_PORT: Joi.string().default(3003),
      }),
      envFilePath: '.env',
    }),

    ClientsModule.registerAsync([
      {
        name: AUTH_CLIENT,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_SERVICE_HOST'),
            port: configService.get('AUTH_SERVICE_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: USER_CLIENT,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('USER_SERVICE_HOST'),
            port: configService.get('USER_SERVICE_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'MOVIE_CLIENT',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('MOVIE_SERVICE_HOST'),
            port: configService.get('MOVIE_SERVICE_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [UserController, AuthController],
  providers: [
    {
      provide: USER_SERVICE,
      useClass: UserProxy,
    },
    {
      provide: AUTH_SERVICE,
      useClass: AuthProxy,
    },
  ],
})
export class AppModule {}
