import { Observable } from 'rxjs';
import { SearchMovieDto } from '@app/movie/domain/dto/search-movie.dto';
import { CreateMovieDto } from '@app/movie/domain/dto/create-movie.dto';
import { UpdateMovieDto } from '@app/movie/domain/dto/update-movie.dto';
import { DeleteMovieDto } from '@app/movie/domain/dto/delete-movie.dto';
import { Movie } from '@app/movie/domain/entities/movie.entity';

export const MOVIE_CLIENT = 'MOVIE_CLIENT';
export const MOVIE_SERVICE = 'MOVIE_SERVICE';

export enum MOVIE_CLIENT_CMD {
  FIND = 'MOVIE_FIND',
  FIND_BY_ID = 'MOVIE_FIND_BY_ID',
  CREATE = 'MOVIE_CREATE',
  UPDATE = 'MOVIE_UPDATE',
  DELETE = 'MOVIE_DELETE',
}

export interface IMovieService {
  find(input: SearchMovieDto): Observable<Movie[]>;

  findById(id: string): Observable<Movie>;

  create(input: CreateMovieDto): Observable<Movie>;

  update(_id: number, input: UpdateMovieDto): Observable<Movie>;

  delete(input: DeleteMovieDto): Observable<Movie>;
}
