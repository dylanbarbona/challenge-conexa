import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@app/shared/repository/base.repository';
import {
  EXTERNAL_MOVIE_REPOSITORY,
  IExternalMovieRepository,
  IMovieRepository,
} from '@app/movie/domain/contracts/movie.repository';
import { MovieDocument } from '@app/movie/infrastructure/schemas/movie.schema';
import { Movie } from '@app/movie/domain/entities/movie.entity';
import { MOVIE_DATABASE } from '@app/movie/movie.module';
import { CreateMovieDto } from '@app/movie/domain/dto/create-movie.dto';
import { SearchMovieDto } from '@app/movie/domain/dto/search-movie.dto';
import { UpdateMovieDto } from '@app/movie/domain/dto/update-movie.dto';

@Injectable()
export class MongoMovieRepository<T extends MovieDocument>
  extends BaseRepository<T>
  implements IMovieRepository, IExternalMovieRepository
{
  constructor(
    @InjectModel(Movie.name, MOVIE_DATABASE)
    protected readonly model: Model<T>,
    @InjectConnection(MOVIE_DATABASE) protected readonly connection: Connection,
    @Inject(EXTERNAL_MOVIE_REPOSITORY)
    private readonly externalMovieRepository: IExternalMovieRepository,
  ) {
    super();
  }

  async findById(id: string): Promise<Movie> {
    let movie;
    try {
      movie = await super.findOne({ external_id: id });
    } catch (e) {
      movie = await this.externalMovieRepository.findById(id);
      await super.upsert({ external_id: movie.external_id }, movie, {
        new: true,
        upsert: true,
      });
    }
    try {
      movie = await super.findOne({
        external_id: movie.external_id,
        deletedAt: null,
      });
    } catch (error) {
      movie = null;
    }
    if (!movie) throw new NotFoundException('La pelicula no existe');
    return new Movie(movie);
  }

  async create(input: CreateMovieDto): Promise<Movie> {
    await super.upsert(
      { external_id: input.external_id },
      { ...input, deletedAt: null },
      {
        new: true,
        upsert: true,
      },
    );
    const movie = await this.findById(String(input.external_id));
    return new Movie(movie);
  }

  async search(input: SearchMovieDto): Promise<Movie[]> {
    let movies = await this.externalMovieRepository.search(input);
    for (const movie of movies) {
      await super.upsert({ external_id: movie.external_id }, movie, {
        new: true,
        upsert: true,
      });
    }

    const regex = new RegExp(input.query, 'i');
    movies = await super.search(
      {
        $and: [
          {
            $or: [
              {
                title: { $regex: regex },
              },
              {
                opening_crawl: { $regex: regex },
              },
              {
                director: { $regex: regex },
              },
              {
                producer: { $regex: regex },
              },
            ],
          },
          {
            deletedAt: null,
          },
        ],
      },
      {},
      {
        limit: input.limit,
        skip: input.skip,
      },
    );
    return movies.map((movie) => new Movie(movie));
  }

  async updateById(id: number, input: UpdateMovieDto): Promise<Movie> {
    const { _id, ...movie } = await this.findById(String(id));
    const updatedMovie = await this.model.findByIdAndUpdate(
      _id,
      {
        ...movie,
        ...input,
        updatedAt: new Date(),
      },
      { new: true },
    );
    return new Movie(updatedMovie);
  }

  async deleteById(id): Promise<Movie> {
    const { _id, ...movie } = await this.findById(String(id));
    const deletedMovie = await this.model.findByIdAndUpdate(
      _id,
      { ...movie, deletedAt: new Date() },
      { new: true },
    );
    return new Movie(deletedMovie);
  }
}
