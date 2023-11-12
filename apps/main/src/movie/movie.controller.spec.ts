import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from '@app/main/movie/movie.controller';
import {
  IMovieService,
  MOVIE_SERVICE,
} from '@app/movie/domain/contracts/movie.service';
import { SearchMovieDto } from '@app/movie/domain/dto/search-movie.dto';
import { faker } from '@faker-js/faker';
import { Observable, of } from 'rxjs';
import { Movie } from '@app/movie/domain/entities/movie.entity';
import { AUTH_SERVICE } from '@app/auth/domain/contracts/auth.service';
import { CreateMovieDto } from '@app/movie/domain/dto/create-movie.dto';
import { UpdateMovieDto } from '@app/movie/domain/dto/update-movie.dto';

describe('Main/MovieController', () => {
  let movieController: MovieController;
  let movieService: jest.Mocked<IMovieService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: MOVIE_SERVICE,
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: AUTH_SERVICE,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
            whoAmI: jest.fn(),
          },
        },
      ],
    }).compile();

    movieController = app.get(MovieController);
    movieService = app.get(MOVIE_SERVICE);
  });

  it('find', () => {
    // Arrange
    const input = {
      query: faker.string.sample(),
      skip: 0,
      limit: 10,
    } as SearchMovieDto;
    const movies = [
      new Movie({
        _id: faker.string.uuid(),
        title: faker.lorem.sentence(),
        director: faker.person.firstName(),
        genre: faker.music.genre(),
        synopsis: faker.lorem.text(),
      }),
    ];
    movieService.find.mockReturnValueOnce(of(movies));

    // Act
    const result = movieController.find(input);

    // Assert
    expect(movieService.find).toHaveBeenCalledWith(input);
    expect(result).toBeInstanceOf(Observable<Movie[]>);
  });

  it('findById', () => {
    // Arrange
    const id = faker.number.int();
    const movie = new Movie({
      _id: faker.string.uuid(),
      title: faker.lorem.sentence(),
      director: faker.person.firstName(),
      genre: faker.music.genre(),
      synopsis: faker.lorem.text(),
    });
    movieService.findById.mockReturnValueOnce(of(movie));

    // Act
    const result = movieController.findById(id);

    // Assert
    expect(movieService.findById).toHaveBeenCalledWith(id);
    expect(result).toBeInstanceOf(Observable<Movie>);
  });

  it('create', () => {
    // Arrange
    const createMovieDto = {} as CreateMovieDto;
    const movie = new Movie(createMovieDto);
    movieService.create.mockReturnValueOnce(of(movie));

    // Act
    const result = movieController.create(createMovieDto);

    // Assert
    expect(movieService.create).toHaveBeenCalledWith(createMovieDto);
    expect(result).toBeInstanceOf(Observable<Movie>);
  });

  it('update', () => {
    // Arrange
    const id = faker.number.int();
    const updateMovieDto = {} as UpdateMovieDto;
    const movie = new Movie(updateMovieDto);
    movieService.update.mockReturnValueOnce(of(movie));

    // Act
    const result = movieController.update(id, updateMovieDto);

    // Assert
    expect(movieService.update).toHaveBeenCalledWith(id, {
      ...updateMovieDto,
      external_id: id,
    });
    expect(result).toBeInstanceOf(Observable<Movie>);
  });

  it('delete', () => {
    // Arrange
    const _id = faker.number.int();
    const movie = new Movie({
      _id,
      title: faker.lorem.sentence(),
      director: faker.person.firstName(),
      genre: faker.music.genre(),
      synopsis: faker.lorem.text(),
    });
    movieService.delete.mockReturnValueOnce(of(movie));

    // Act
    const result = movieController.delete(_id);

    // Assert
    expect(movieService.delete).toHaveBeenCalledWith({ external_id: _id });
    expect(result).toBeInstanceOf(Observable<Movie>);
  });
});
