import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  IMovieService,
  MOVIE_CLIENT,
  MOVIE_CLIENT_CMD,
} from '@app/movie/domain/contracts/movie.service';
import { Movie } from '@app/movie/domain/entities/movie.entity';
import { SearchMovieDto } from '@app/movie/domain/dto/search-movie.dto';
import { CreateMovieDto } from '@app/movie/domain/dto/create-movie.dto';
import { UpdateMovieDto } from '@app/movie/domain/dto/update-movie.dto';
import { DeleteMovieDto } from '@app/movie/domain/dto/delete-movie.dto';

export class MovieProxy implements IMovieService {
  constructor(@Inject(MOVIE_CLIENT) private readonly client: ClientProxy) {}

  find(input: SearchMovieDto): Observable<Movie[]> {
    return this.client.send({ cmd: MOVIE_CLIENT_CMD.FIND }, input);
  }

  findById(id: number): Observable<Movie> {
    return this.client.send({ cmd: MOVIE_CLIENT_CMD.FIND_BY_ID }, { id });
  }

  create(input: CreateMovieDto): Observable<Movie> {
    return this.client.send({ cmd: MOVIE_CLIENT_CMD.CREATE }, input);
  }

  update(_id: number, input: UpdateMovieDto): Observable<Movie> {
    return this.client.send(
      { cmd: MOVIE_CLIENT_CMD.UPDATE },
      {
        ...input,
        external_id: _id,
      },
    );
  }

  delete(input: DeleteMovieDto): Observable<Movie> {
    return this.client.send({ cmd: MOVIE_CLIENT_CMD.DELETE }, input);
  }
}
