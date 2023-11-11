import { Test, TestingModule } from '@nestjs/testing';
import {
  IMovieService,
  MOVIE_SERVICE,
} from '@app/movie/domain/contracts/movie.service';
import { MovieService } from '@app/movie/application/services/movie.service';
import {
  IMovieRepository,
  MOVIE_REPOSITORY,
} from '@app/movie/domain/contracts/movie.repository';
import { SearchMovieDto } from '@app/movie/domain/dto/search-movie.dto';
import { Movie } from '@app/movie/domain/entities/movie.entity';
import { Observable } from 'rxjs';
import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { CreateMovieDto } from '@app/movie/domain/dto/create-movie.dto';
import { UpdateMovieDto } from '@app/movie/domain/dto/update-movie.dto';
import { DeleteMovieDto } from '@app/movie/domain/dto/delete-movie.dto';

describe('MovieService', () => {
  let movieService: IMovieService;
  let movieRepository: jest.Mocked<IMovieRepository>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MOVIE_SERVICE,
          useClass: MovieService,
        },
        {
          provide: MOVIE_REPOSITORY,
          useValue: {
            search: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            updateById: jest.fn(),
            deleteById: jest.fn(),
          },
        },
      ],
    }).compile();

    movieService = app.get(MOVIE_SERVICE);
    movieRepository = app.get(MOVIE_REPOSITORY);
  });

  it('should be defined', () => {
    expect(movieService).toBeDefined();
  });

  describe('find', () => {
    it('should return a list of movies', async () => {
      // Arrange
      const searchDto = {
        query: '',
        skip: 1,
        limit: 10,
      } as SearchMovieDto;
      const movies: Movie[] = [new Movie({})];
      movieRepository.search.mockReturnValueOnce(Promise.resolve(movies));

      // Act
      const result = await movieService.find(searchDto);

      // Assert
      expect(result).toBeInstanceOf(Observable<Movie[]>);
      result.subscribe((movies) => expect(movies).toEqual(movies));
    });
  });

  describe('findById', () => {
    it('should return a movie by ID', async () => {
      // Arrange
      const movieId = faker.string.uuid();
      const movie: Movie = new Movie({});
      movieRepository.findById.mockReturnValueOnce(Promise.resolve(movie));

      // Act
      const result = await movieService.findById(movieId);

      // Assert
      expect(result).toBeInstanceOf(Observable<Movie>);
      result.subscribe((movie) => expect(movie).toEqual(movie));
    });

    it('should throw an exception if movie id doesnt exist', async () => {
      // Arrange
      const movieId = faker.string.uuid();
      const movie: Movie = new Movie({});
      movieRepository.findById.mockReturnValueOnce(
        Promise.reject(new BadRequestException()),
      );

      // Act
      try {
        await movieService.findById(movieId).toPromise();
      } catch (e) {
        // Assert
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      // Arrange
      const movie: Movie = new Movie({
        _id: faker.string.uuid(),
        title: faker.lorem.sentence(),
        director: faker.person.firstName(),
        genre: faker.music.genre(),
        synopsis: faker.lorem.text(),
      });
      const createDto = {} as CreateMovieDto;
      movieRepository.create.mockReturnValueOnce(Promise.resolve(movie));

      // Act
      const result = await movieService.create(createDto);

      // Assert
      expect(result).toBeInstanceOf(Observable<Movie>);
      result.subscribe((movie) => expect(movie).toEqual(movie));
    });
  });

  describe('update', () => {
    it('should update a movie by ID', async () => {
      // Arrange
      const movie: Movie = new Movie({
        _id: faker.string.uuid(),
        title: faker.lorem.sentence(),
        director: faker.person.firstName(),
        genre: faker.music.genre(),
        synopsis: faker.lorem.text(),
      });
      const updateMovieDto = {} as UpdateMovieDto;

      movieRepository.updateById.mockReturnValueOnce(Promise.resolve(movie));

      // Act
      const result = await movieService.update(movie._id, updateMovieDto);

      // Assert
      expect(result).toBeInstanceOf(Observable<Movie>);
      result.subscribe((movie) => expect(movie).toEqual(movie));
    });

    it('should throw an exception if movie id doesnt exist during update', async () => {
      // Arrange
      const _id = faker.number.int();
      const updateMovieDto = {} as UpdateMovieDto;

      movieRepository.updateById.mockReturnValueOnce(
        Promise.reject(new BadRequestException()),
      );

      // Act & Assert
      try {
        await movieService.update(_id, updateMovieDto).toPromise();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error).toBeDefined();
      }
    });
  });

  describe('delete', () => {
    it('should update a movie by ID', async () => {
      // Arrange
      const movie: Movie = new Movie({ external_id: faker.number.int() });

      movieRepository.deleteById.mockReturnValueOnce(Promise.resolve(movie));

      // Act
      const result = await movieService.delete({
        external_id: movie.external_id,
      });

      // Assert
      expect(result).toBeInstanceOf(Observable<Movie>);
      result.subscribe((movie) => expect(movie).toEqual(movie));
    });

    it('should throw an exception if movie id doesnt exist during delete', async () => {
      // Arrange
      const _id = faker.number.int();

      movieRepository.deleteById.mockReturnValueOnce(
        Promise.reject(new BadRequestException()),
      );

      // Act & Assert
      try {
        await movieService
          .delete({ external_id: _id } as DeleteMovieDto)
          .toPromise();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error).toBeDefined();
      }
    });
  });
});
