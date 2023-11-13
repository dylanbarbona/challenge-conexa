import { SearchMovieDto } from '@app/movie/domain/dto/search-movie.dto';
import { Movie } from '@app/movie/domain/entities/movie.entity';
import { CreateMovieDto } from '@app/movie/domain/dto/create-movie.dto';

export const MOVIE_REPOSITORY = 'MOVIE_REPOSITORY';
export const EXTERNAL_MOVIE_REPOSITORY = 'EXTERNAL_MOVIE_REPOSITORY';

export interface IExternalMovieRepository {
  search(input: SearchMovieDto): Promise<Movie[]>;

  findOne(input: Partial<Movie>): Promise<Movie>;
}

export interface IMovieRepository extends IExternalMovieRepository {
  create(input: CreateMovieDto): Promise<Movie>;

  update(
    filter: Partial<Movie>,
    input: Partial<Movie>,
    options?: any,
  ): Promise<Movie>;

  upsert(
    filter: Partial<Movie>,
    input: Partial<Movie>,
    options?: any,
  ): Promise<Movie>;

  deleteOne(filter: { external_id: number }): Promise<Movie>;
}
