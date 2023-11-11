import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { MongooseModule } from '@nestjs/mongoose';
import { MongoMovieRepository } from '@app/movie/infrastructure/repositories/mongo-movie.repository';
import { MovieService } from '@app/movie/application/services/movie.service';
import { MovieController } from '@app/movie/infrastructure/controllers/movie.controller';
import { Movie } from '@app/movie/domain/entities/movie.entity';
import { MOVIE_SERVICE } from '@app/movie/domain/contracts/movie.service';
import {
  EXTERNAL_MOVIE_REPOSITORY,
  MOVIE_REPOSITORY,
} from '@app/movie/domain/contracts/movie.repository';
import { MovieSchema } from '@app/movie/infrastructure/schemas/movie.schema';

import * as Joi from 'joi';
import { ExternalMovieRepository } from '@app/movie/infrastructure/repositories/external-movie.repository';

export const MOVIE_DATABASE = 'movie-db';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MOVIE_SERVICE_HOST: Joi.string().default('0.0.0.0'),
        MOVIE_SERVICE_PORT: Joi.number().default(3003),
        MONGODB_URI: Joi.string().default(
          'mongodb://root:root@localhost:27017',
        ),
        EXTERNAL_MOVIE_SERVICE: Joi.string().default(
          'https://swapi.dev/api/films/',
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
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
  ],
  controllers: [MovieController],
  providers: [
    ConfigService,
    { provide: MOVIE_SERVICE, useClass: MovieService },
    { provide: MOVIE_REPOSITORY, useClass: MongoMovieRepository },
    { provide: EXTERNAL_MOVIE_REPOSITORY, useClass: ExternalMovieRepository },
  ],
})
export class MovieModule {}
