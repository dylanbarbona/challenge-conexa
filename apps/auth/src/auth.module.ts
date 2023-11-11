import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

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
        name: 'USER_CLIENT',
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
  providers: [AuthService],
})
export class AuthModule {}
