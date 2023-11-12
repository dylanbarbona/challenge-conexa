import { Test, TestingModule } from '@nestjs/testing';
import {
  AUTH_SERVICE,
  IAuthService,
} from '@app/auth/domain/contracts/auth.service';
import { AuthService } from '@app/auth/application/services/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import {
  IUserService,
  USER_SERVICE,
} from '@app/user/domain/contracts/user.service';
import { LoginUserDto } from '@app/auth/domain/dto/login-user.dto';
import { Observable, of, throwError } from 'rxjs';
import { faker } from '@faker-js/faker';
import { User } from '@app/user/domain/entities/user.entity';
import { AccessTokenEntity } from '@app/auth/domain/entities/access.token';
import { RegisterUserDto } from '@app/auth/domain/dto/register-user.dto';
import { Types } from 'mongoose';
import {
  BadRequestException,
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

describe('Main/MovieController', () => {
  let authService: IAuthService;
  let jwtService: JwtService;
  let userService: jest.Mocked<IUserService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: 'secret',
          signOptions: {
            expiresIn: '60s',
          },
        }),
      ],
      controllers: [],
      providers: [
        {
          provide: AUTH_SERVICE,
          useClass: AuthService,
        },
        {
          provide: USER_SERVICE,
          useValue: {
            findByEmailAndPassword: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = app.get(AUTH_SERVICE);
    userService = app.get(USER_SERVICE);
    jwtService = app.get(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token on successful login', async () => {
      // Arrange
      const loginDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      } as LoginUserDto;
      const user = new User({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: loginDto.email,
        password: loginDto.password,
      });
      const payload = { ...user };

      const expectedAccessToken = jwtService.sign(payload);
      userService.findByEmailAndPassword.mockReturnValueOnce(of(user));

      // Act
      const result = await authService.login(loginDto);

      // Assert
      expect(result).toBeInstanceOf(Observable<AccessTokenEntity>);
      result.subscribe((accessToken) =>
        expect(accessToken).toEqual({ access_token: expectedAccessToken }),
      );
    });

    it('should handle errors during login', async () => {
      // Arrange
      const loginDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      } as LoginUserDto;
      userService.findByEmailAndPassword.mockReturnValueOnce(
        throwError(new NotFoundException()),
      );

      // Act
      try {
        await authService.login(loginDto).toPromise();
      } catch (e) {
        // Assert
        expect(e).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('register', () => {
    it('should return an access token on successful registration', async () => {
      // Arrange
      const registerDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      } as RegisterUserDto;
      const user = new User(registerDto);
      const payload = { ...user };
      const expectedAccessToken = jwtService.sign(payload);
      userService.create.mockReturnValueOnce(of(user));

      // Act
      const result = await authService.register(registerDto);

      // Assert
      expect(result).toBeInstanceOf(Observable<AccessTokenEntity>);
      result.subscribe((accessToken) =>
        expect(accessToken).toEqual({ access_token: expectedAccessToken }),
      );
    });

    it('should handle errors during registration', async () => {
      // Arrange
      const registerDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      } as RegisterUserDto;
      userService.create.mockReturnValueOnce(
        throwError(new BadRequestException()),
      );

      // Act

      try {
        await authService.register(registerDto).toPromise();
      } catch (e) {
        // Assert
        expect(e).toBeDefined();
      }
    });
  });

  describe('whoAmI', () => {
    it('should return user information for a valid access token', async () => {
      // Arrange
      const user = new User({
        _id: new Types.ObjectId(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
      });
      const validAccessToken = jwtService.sign({ ...user });

      // Act
      const result = await authService.whoAmI({
        access_token: validAccessToken,
      });

      // Assert
      expect(result).toBeInstanceOf(Observable<User>);

      result.subscribe((res) => expect(res).toEqual(user));
    });

    it('should handle errors for an invalid access token', async () => {
      // Arrange
      const invalidAccessToken = 'invalidToken';

      // Act
      try {
        await authService
          .whoAmI({
            access_token: invalidAccessToken,
          })
          .toPromise();
      } catch (error) {
        // Assert
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
