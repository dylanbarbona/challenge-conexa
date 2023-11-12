import { BadRequestException, Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@app/shared/repository/base.repository';
import {
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
  ) {
    super();
  }

  async search(input: SearchMovieDto): Promise<Movie[]> {
    const regex = new RegExp(input.query, 'i');
    const movies = await super.search(
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

  async findOne({ external_id }: { external_id: number }): Promise<Movie> {
    const movie = await super.findOne({ external_id });
    return new Movie(movie);
  }

  async create(input: CreateMovieDto): Promise<Movie> {
    try {
      const movie = await super.create(input);
      return new Movie(movie);
    } catch (e) {
      throw new BadRequestException('Error al crear la película');
    }
  }

  async update(
    filter: { external_id: number },
    input: UpdateMovieDto,
  ): Promise<Movie> {
    const { _id, ...movie } = await this.findById(String(filter.external_id));
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

  async deleteOne({ external_id }: { external_id: number }): Promise<Movie> {
    const { _id, ...movie } = await this.findOne({ external_id });
    const deletedMovie = await this.model.findByIdAndUpdate(
      _id,
      { ...movie, deletedAt: new Date() },
      { new: true },
    );
    return new Movie(deletedMovie);
  }
}
