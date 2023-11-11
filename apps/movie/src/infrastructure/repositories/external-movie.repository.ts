import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { Movie } from '@app/movie/domain/entities/movie.entity';
import { SearchMovieDto } from '@app/movie/domain/dto/search-movie.dto';
import { IExternalMovieRepository } from '@app/movie/domain/contracts/movie.repository';

@Injectable()
export class ExternalMovieRepository implements IExternalMovieRepository {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async findById(id: string): Promise<Movie> {
    try {
      const response = await this.httpService
        .get(this.configService.get('EXTERNAL_MOVIE_SERVICE') + id)
        .toPromise();
      const movieData = response.data;
      return new Movie({ ...movieData, external_id: id });
    } catch (error) {
      throw new InternalServerErrorException('Error al buscar la película');
    }
  }

  async search(input: SearchMovieDto): Promise<Movie[]> {
    try {
      const query = `${this.configService.get('EXTERNAL_MOVIE_SERVICE')}?${
        input?.query ? '?search=' + input?.query : ''
      }`;
      const response = await this.httpService.get(query).toPromise();
      return response?.data?.results?.map((movieData) => {
        const regex = /\/films\/(\d+)\//;
        const match = regex.exec(movieData.url);
        const external_id = match ? match[1] : null;
        return new Movie({ ...movieData, external_id });
      });
    } catch (e) {
      throw new InternalServerErrorException('Error al buscar las películas');
    }
  }
}
