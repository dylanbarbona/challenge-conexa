import { Test, TestingModule } from '@nestjs/testing';
import {
  IMovieService,
  MOVIE_SERVICE,
} from '@app/movie/domain/contracts/movie.service';
import { MovieService } from '@app/movie/application/services/movie.service';
import {
  EXTERNAL_MOVIE_REPOSITORY,
  IExternalMovieRepository,
  IMovieRepository,
  MOVIE_REPOSITORY,
} from '@app/movie/domain/contracts/movie.repository';
import { SearchMovieDto } from '@app/movie/domain/dto/search-movie.dto';
import { Movie } from '@app/movie/domain/entities/movie.entity';
import { Observable } from 'rxjs';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { CreateMovieDto } from '@app/movie/domain/dto/create-movie.dto';
import { UpdateMovieDto } from '@app/movie/domain/dto/update-movie.dto';
import { DeleteMovieDto } from '@app/movie/domain/dto/delete-movie.dto';

describe('MovieService', () => {
  let movieService: IMovieService;
  let movieRepository: jest.Mocked<IMovieRepository>;
  let externalMovieRepository: jest.Mocked<IExternalMovieRepository>;

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
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            deleteOne: jest.fn(),
          } as IMovieRepository,
        },
        {
          provide: EXTERNAL_MOVIE_REPOSITORY,
          useValue: {
            findOne: jest.fn(),
            search: jest.fn(),
          } as IExternalMovieRepository,
        },
      ],
    }).compile();

    movieService = app.get(MOVIE_SERVICE);
    movieRepository = app.get(MOVIE_REPOSITORY);
    externalMovieRepository = app.get(EXTERNAL_MOVIE_REPOSITORY);
  });

  afterEach(() => jest.clearAllMocks());

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

      externalMovieRepository.search.mockReturnValueOnce(
        Promise.resolve(movies),
      );
      movieRepository.search.mockReturnValueOnce(Promise.resolve(movies));

      // Act
      const result = await movieService.find(searchDto);

      // Assert
      expect(result).toBeInstanceOf(Observable<Movie[]>);
      result.subscribe((movies) => expect(movies).toEqual(movies));
    });

    it('should handle exceptions from external movie repository', async () => {
      // Arrange
      const searchDto = {
        query: '',
        skip: 1,
        limit: 10,
      } as SearchMovieDto;
      const movies: Movie[] = [new Movie({})];

      externalMovieRepository.search.mockReturnValueOnce(
        Promise.reject(new InternalServerErrorException()),
      );
      movieRepository.search.mockReturnValueOnce(Promise.resolve(movies));

      // Act
      try {
        await movieService.find(searchDto).toPromise();
      } catch (error) {
        // Assert
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });

    it('should handle exceptions from movie repository', async () => {
      // Arrange
      const searchDto = {
        query: '',
        skip: 1,
        limit: 10,
      } as SearchMovieDto;
      const movies: Movie[] = [new Movie({})];

      externalMovieRepository.search.mockReturnValueOnce(
        Promise.resolve(movies),
      );
      movieRepository.search.mockReturnValueOnce(
        Promise.reject(new InternalServerErrorException()),
      );

      // Act
      try {
        await movieService.find(searchDto).toPromise();
      } catch (error) {
        // Assert
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('findById', () => {
    it('should return a movie by ID', async () => {
      // Arrange
      const movieId = faker.number.int();
      const movie: Movie = new Movie({});
      movieRepository.findOne.mockReturnValueOnce(Promise.resolve(movie));

      // Act
      const result = await movieService.findById(movieId);

      // Assert
      expect(result).toBeInstanceOf(Observable<Movie>);
      result.subscribe((movie) => expect(movie).toEqual(movie));
    });

    it('should return external movie by ID', async () => {
      // Arrange
      const movieId = faker.number.int();
      const movie: Movie = new Movie({ external_id: movieId });
      movieRepository.findOne.mockReturnValueOnce(
        Promise.reject(new NotFoundException()),
      );
      movieRepository.update.mockReturnValueOnce(Promise.resolve(movie));
      externalMovieRepository.findOne.mockReturnValueOnce(
        Promise.resolve(movie),
      );

      // Act
      const result = await movieService.findById(movieId);

      // Assert
      expect(result).toBeInstanceOf(Observable<Movie>);
      result.subscribe((movie) => expect(movie).toEqual(movie));
    });

    it('should throw an exception if movie id doesnt exist', async () => {
      // Arrange
      const movieId = faker.number.int();
      movieRepository.findOne.mockReturnValueOnce(
        Promise.reject(new NotFoundException()),
      );
      externalMovieRepository.findOne.mockReturnValueOnce(
        Promise.reject(new NotFoundException()),
      );

      // Act
      try {
        await movieService.findById(movieId).toPromise();
      } catch (error) {
        // Assert
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      // Arrange
      const external_id = faker.number.int();
      const movie: Movie = new Movie({ external_id });
      const createDto = { external_id } as CreateMovieDto;
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
      const _id = faker.string.uuid();
      const oldName = faker.person.firstName();
      const newName = faker.person.firstName();
      const movie: Movie = new Movie({
        _id,
        external_id: faker.number.int(),
        title: oldName,
      });
      const updateMovieDto = { title: newName } as UpdateMovieDto;
      const newMovie = new Movie({ ...movie, ...updateMovieDto });

      movieRepository.update.mockReturnValueOnce(Promise.resolve(movie));
      movieRepository.findOne.mockReturnValueOnce(Promise.resolve(newMovie));

      // Act
      const result = await movieService.update(
        movie.external_id,
        updateMovieDto,
      );

      // Assert
      expect(result).toBeInstanceOf(Observable<Movie>);
      result.subscribe((movie) => expect(movie).toEqual(movie));
    });

    it('should throw an exception if movie id doesnt exist during update', async () => {
      // Arrange
      const _id = faker.number.int();
      const updateMovieDto = {} as UpdateMovieDto;

      movieRepository.update.mockReturnValueOnce(
        Promise.reject(new NotFoundException()),
      );

      // Act & Assert
      try {
        await movieService.update(_id, updateMovieDto).toPromise();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error).toBeDefined();
      }
    });
  });

  describe('delete', () => {
    it('should update a movie by ID', async () => {
      // Arrange
      const deletedAt = new Date();
      const movie: Movie = new Movie({
        external_id: faker.number.int(),
        _id: faker.number.int(),
      });
      const newMovie = new Movie({ ...movie, deletedAt });

      movieRepository.findOne.mockReturnValueOnce(Promise.resolve(movie));
      movieRepository.deleteOne.mockReturnValueOnce(Promise.resolve(newMovie));

      // Act
      const result = await movieService
        .delete({
          external_id: movie.external_id,
        })
        .toPromise();

      // Assert
      expect(result).toBeInstanceOf(Movie);
      expect(result).toEqual(newMovie);
    });

    it('should throw an exception if movie id doesnt exist during delete', async () => {
      // Arrange
      const _id = faker.number.int();

      movieRepository.findOne.mockReturnValueOnce(
        Promise.reject(new NotFoundException()),
      );

      // Act & Assert
      try {
        await movieService
          .delete({ external_id: _id } as DeleteMovieDto)
          .toPromise();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error).toBeDefined();
      }
    });
  });
});
