import { Observable } from 'rxjs';
import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MovieService } from '@app/movie/application/services/movie.service';
import {
  MOVIE_CLIENT_CMD,
  MOVIE_SERVICE,
} from '@app/movie/domain/contracts/movie.service';
import { Movie } from '@app/movie/domain/entities/movie.entity';
import { SearchMovieDto } from '@app/movie/domain/dto/search-movie.dto';
import { CreateMovieDto } from '@app/movie/domain/dto/create-movie.dto';
import { UpdateMovieDto } from '@app/movie/domain/dto/update-movie.dto';
import { DeleteMovieDto } from '@app/movie/domain/dto/delete-movie.dto';

@Controller()
export class MovieController {
  constructor(
    @Inject(MOVIE_SERVICE) private readonly movieService: MovieService,
  ) {}

  @MessagePattern({ cmd: MOVIE_CLIENT_CMD.FIND })
  find(input: SearchMovieDto): Observable<Movie[]> {
    return this.movieService.find(input);
  }

  @MessagePattern({ cmd: MOVIE_CLIENT_CMD.FIND_BY_ID })
  findById(input: { id: number }): Observable<Movie> {
    return this.movieService.findById(input.id);
  }

  @MessagePattern({ cmd: MOVIE_CLIENT_CMD.CREATE })
  create(input: CreateMovieDto): Observable<Movie> {
    return this.movieService.create(input);
  }

  @MessagePattern({ cmd: MOVIE_CLIENT_CMD.UPDATE })
  update(input: UpdateMovieDto): Observable<Movie> {
    return this.movieService.update(input.external_id, input);
  }

  @MessagePattern({ cmd: MOVIE_CLIENT_CMD.DELETE })
  delete(input: DeleteMovieDto): Observable<Movie> {
    return this.movieService.delete(input);
  }
}
