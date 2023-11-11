import { SearchMovieDto } from '@app/movie/domain/dto/search-movie.dto';
import { Movie } from '@app/movie/domain/entities/movie.entity';
import { CreateMovieDto } from '@app/movie/domain/dto/create-movie.dto';
import { UpdateMovieDto } from '@app/movie/domain/dto/update-movie.dto';

export const MOVIE_REPOSITORY = 'MOVIE_REPOSITORY';
export const EXTERNAL_MOVIE_REPOSITORY = 'EXTERNAL_MOVIE_REPOSITORY';

export interface IExternalMovieRepository {
  search(input: SearchMovieDto): Promise<Movie[]>;

  findById(id: string): Promise<Movie>;
}

export interface IMovieRepository extends IExternalMovieRepository {
  create(input: CreateMovieDto): Promise<Movie>;

  updateById(id: number, input: UpdateMovieDto): Promise<Movie>;

  deleteById(id: number): Promise<Movie>;
}
