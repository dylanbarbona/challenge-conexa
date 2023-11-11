import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { faker } from '@faker-js/faker';
import {
  IUserService,
  USER_SERVICE,
} from '@app/user/domain/contracts/user.service';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '@app/user/domain/contracts/user.repository';
import { User } from '@app/user/domain/entities/user.entity';
import { UserService } from '@app/user/application/services/user.service';
import { SearchUserDto } from '@app/user/domain/dto/search-user.dto';
import { CreateUserDto } from '@app/user/domain/dto/create-user.dto';
import { UpdateUserDto } from '@app/user/domain/dto/update-user.dto';
import { DeleteUserDto } from '@app/user/domain/dto/delete-user.dto';

describe('UserSerivce', () => {
  let userService: IUserService;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: USER_SERVICE,
          useClass: UserService,
        },
        {
          provide: USER_REPOSITORY,
          useValue: {
            search: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            updateById: jest.fn(),
            deleteById: jest.fn(),
            findByEmailAndPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = app.get(USER_SERVICE);
    userRepository = app.get(USER_REPOSITORY);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('find', () => {
    it('should return a list of users', async () => {
      // Arrange
      const searchDto = {
        query: '',
        skip: 1,
        limit: 10,
      } as SearchUserDto;
      const users: User[] = [new User({})];
      userRepository.search.mockReturnValueOnce(Promise.resolve(users));

      // Act
      const result = userService.find(searchDto);

      // Assert
      expect(result).toBeInstanceOf(Observable<User[]>);
      result.subscribe((users) => expect(users).toEqual(users));
    });
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      // Arrange
      const userId = faker.string.uuid();
      const user: User = new User({});
      userRepository.findById.mockReturnValueOnce(Promise.resolve(user));

      // Act
      const result = userService.findById(userId);

      // Assert
      expect(result).toBeInstanceOf(Observable<User>);
      result.subscribe((user) => expect(user).toEqual(user));
    });

    it('should throw an exception if user id doesnt exist', async () => {
      // Arrange
      const userId = faker.string.uuid();
      userRepository.findById.mockReturnValueOnce(
        Promise.reject(new NotFoundException()),
      );

      try {
        // Act
        await userService.findById(userId).toPromise();
      } catch (e) {
        // Assert
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // Arrange
      const user = new User({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.string.uuid(),
      });
      const createDto = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
      } as CreateUserDto;
      userRepository.create.mockReturnValueOnce(Promise.resolve(user));

      // Act
      const result = userService.create(createDto);

      // Assert
      expect(result).toBeInstanceOf(Observable<User>);
      result.subscribe((user) => expect(user).toEqual(user));
    });
  });

  describe('update', () => {
    it('should update a user by ID', async () => {
      // Arrange
      const _id = faker.string.uuid();
      const user: User = new User({
        _id,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.string.uuid(),
      });
      const updateUserDto = {
        auth: { _id },
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
      } as UpdateUserDto;

      userRepository.updateById.mockReturnValueOnce(Promise.resolve(user));

      // Act
      const result = userService.update(user._id, updateUserDto);

      // Assert
      expect(result).toBeInstanceOf(Observable<User>);
      result.subscribe((user) => expect(user).toEqual(user));
    });

    it('should throw an exception if user id doesnt exist during update', async () => {
      // Arrange
      const _id = faker.string.uuid();
      const updateUserDto = {
        auth: { _id },
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.string.uuid(),
      } as UpdateUserDto;

      userRepository.updateById.mockReturnValueOnce(
        Promise.reject(new NotFoundException()),
      );

      // Act & Assert
      try {
        await userService.update(_id, updateUserDto).toPromise();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error).toBeDefined();
      }
    });

    it('should throw an exception if user is unauthorized during update', async () => {
      // Arrange
      const _id = faker.string.uuid();
      const updateUserDto = {
        auth: { _id: faker.string.uuid() },
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.string.uuid(),
      } as UpdateUserDto;

      // Act & Assert
      try {
        await userService.update(_id, updateUserDto).toPromise();
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error).toBeDefined();
      }
    });
  });

  describe('delete', () => {
    it('should update a user by ID', async () => {
      // Arrange
      const _id = faker.string.uuid();
      const user = new User({
        _id,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.string.uuid(),
      });

      userRepository.deleteById.mockReturnValueOnce(Promise.resolve(user));

      // Act
      const result = await userService.delete({ _id, auth: { _id } as User });

      // Assert
      expect(result).toBeInstanceOf(Observable<User>);
      result.subscribe((user) => expect(user).toEqual(user));
    });

    it('should throw an exception if user id doesnt exist during delete', async () => {
      // Arrange
      const _id = faker.string.uuid();
      const input = { _id, auth: { _id } as User } as DeleteUserDto;
      userRepository.deleteById.mockReturnValueOnce(
        Promise.reject(new NotFoundException()),
      );

      // Act & Assert
      try {
        await userService.delete(input).toPromise();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error).toBeDefined();
      }
    });

    it('should throw an exception if user is unauthorized during delete', async () => {
      // Arrange
      const _id = faker.string.uuid();
      const input = {
        _id,
        auth: { _id: faker.string.uuid() } as User,
      } as DeleteUserDto;

      // Act & Assert
      try {
        await userService.delete(input).toPromise();
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error).toBeDefined();
      }
    });
  });
});
