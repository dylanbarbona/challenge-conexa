import { Inject, Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { IMovieService } from '@app/movie/domain/contracts/movie.service';
import {
  IMovieRepository,
  MOVIE_REPOSITORY,
} from '@app/movie/domain/contracts/movie.repository';
import { Movie } from '@app/movie/domain/entities/movie.entity';
import { SearchMovieDto } from '@app/movie/domain/dto/search-movie.dto';
import { CreateMovieDto } from '@app/movie/domain/dto/create-movie.dto';
import { UpdateMovieDto } from '@app/movie/domain/dto/update-movie.dto';
import { DeleteMovieDto } from '@app/movie/domain/dto/delete-movie.dto';

@Injectable()
export class MovieService implements IMovieService {
  constructor(
    @Inject(MOVIE_REPOSITORY)
    private readonly movieRepository: IMovieRepository,
  ) {}

  find(input: SearchMovieDto): Observable<Movie[]> {
    return from(this.movieRepository.search(input));
  }

  findById(id: string): Observable<Movie> {
    return from(this.movieRepository.findById(id));
  }

  create(input: CreateMovieDto): Observable<Movie> {
    return from(this.movieRepository.create(input));
  }

  update(_id: number, input: UpdateMovieDto): Observable<Movie> {
    return from(this.movieRepository.updateById(_id, input));
  }

  delete(input: DeleteMovieDto): Observable<Movie> {
    return from(this.movieRepository.deleteById(input.external_id));
  }
}
