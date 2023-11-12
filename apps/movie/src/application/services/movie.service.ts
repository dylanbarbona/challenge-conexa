import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { catchError, from, map, mergeMap, Observable } from 'rxjs';
import { IMovieService } from '@app/movie/domain/contracts/movie.service';
import {
  EXTERNAL_MOVIE_REPOSITORY,
  IExternalMovieRepository,
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
    @Inject(EXTERNAL_MOVIE_REPOSITORY)
    private readonly externalMovieRepository: IExternalMovieRepository,
  ) {}

  find(input: SearchMovieDto): Observable<Movie[]> {
    return from(this.externalMovieRepository.search(input)).pipe(
      mergeMap(async (movies) => {
        for (const movie of movies) {
          await this.movieRepository.update(
            { external_id: movie.external_id, deletedAt: null },
            movie,
            { new: true, upsert: true },
          );
        }
        return this.movieRepository.search(input);
      }),
    );
  }

  findById(external_id: number): Observable<Movie> {
    return from(this.movieRepository.findOne({ external_id })).pipe(
      catchError(async () => {
        let movie: Movie;

        try {
          movie = await this.externalMovieRepository.findOne({ external_id });
          await this.movieRepository.update(
            { external_id: movie.external_id },
            movie,
          );
        } catch (e) {
          throw new NotFoundException('La película no existe');
        }

        try {
          movie = await this.movieRepository.findOne({
            external_id: movie.external_id,
          });
        } catch (e) {
          movie = null;
        }
        return movie;
      }),
      map((movie) => {
        if (movie?.deletedAt != null) throw new NotFoundException();
        return movie;
      }),
    );
  }

  create(input: CreateMovieDto): Observable<Movie> {
    return from(this.movieRepository.create(input)).pipe(
      mergeMap(async () => {
        return await this.movieRepository.findOne({
          external_id: input.external_id,
        });
      }),
    );
  }

  update(id: number, input: UpdateMovieDto): Observable<Movie> {
    return from(
      this.movieRepository.update(
        { external_id: id },
        { ...(input as Movie), deletedAt: null },
        {
          new: true,
          upsert: true,
        },
      ),
    ).pipe(
      mergeMap(async () => {
        const movie = await this.movieRepository.findOne({
          external_id: input.external_id,
        });
        return new Movie(movie);
      }),
    );
  }

  delete(input: DeleteMovieDto): Observable<Movie> {
    return from(this.movieRepository.findOne(input)).pipe(
      mergeMap(async (movie) => {
        if (movie?.deletedAt != null) throw new NotFoundException();
        return await this.movieRepository.deleteOne(input);
      }),
    );
  }
}
