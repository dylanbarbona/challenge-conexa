import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { UserProxy } from '@app/user/infrastructure/external/user.proxy';
import { AuthService } from '@app/auth/application/services/auth.service';
import { AuthController } from '@app/auth/infrastructure/controllers/auth.controller';
import { AUTH_SERVICE } from '@app/auth/domain/contracts/auth.service';
import {
  USER_CLIENT,
  USER_SERVICE,
} from '@app/user/domain/contracts/user.service';

import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        USER_SERVICE_HOST: Joi.string().default('0.0.0.0'),
        USER_SERVICE_PORT: Joi.number().default(3001),
        AUTH_SERVICE_HOST: Joi.string().default('0.0.0.0'),
        AUTH_SERVICE_PORT: Joi.string().default(3002),
        JWT_SECRET: Joi.string().default('SECRET'),
        JWT_SECRET_EXPIRES_IN: Joi.string().default('3600s'),
      }),
      envFilePath: '.env',
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_SECRET_EXPIRES_IN') },
      }),
    }),

    ClientsModule.registerAsync([
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
    ]),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
    {
      provide: USER_SERVICE,
      useClass: UserProxy,
    },
  ],
})
export class AuthModule {}
