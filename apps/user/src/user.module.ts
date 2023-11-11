import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user.controller';
import { UserService } from './user.service';

import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        USER_SERVICE_HOST: Joi.string().default('0.0.0.0'),
        USER_SERVICE_PORT: Joi.number().default(3001),
        MONGODB_URI: Joi.string().default(
          'mongodb://root:root@localhost:27017',
        ),
      }),
      envFilePath: '.env',
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
