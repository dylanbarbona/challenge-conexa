import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';

import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MOVIE_SERVICE_HOST: Joi.string().default('0.0.0.0'),
        MOVIE_SERVICE_PORT: Joi.number().default(3003),
        MONGODB_URI: Joi.string().default(
          'mongodb://root:root@localhost:27017',
        ),
      }),
      envFilePath: '.env',
    }),
  ],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
