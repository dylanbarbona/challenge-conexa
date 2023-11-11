import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import * as Joi from 'joi';

import { UserController } from '@app/user/infrastructure/controllers/user.controller';
import { UserService } from '@app/user/application/services/user.service';
import { MongoUserRepository } from '@app/user/infrastructure/repository/mongo-user.repository';
import { User } from '@app/user/domain/entities/user.entity';
import { UserSchema } from '@app/user/infrastructure/schemas/user.schema';
import { USER_SERVICE } from '@app/user/domain/contracts/user.service';
import { USER_REPOSITORY } from '@app/user/domain/contracts/user.repository';

export const USER_DATABASE = 'user-db';

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

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [
    { provide: USER_SERVICE, useClass: UserService },
    { provide: USER_REPOSITORY, useClass: MongoUserRepository },
  ],
})
export class UserModule {}
