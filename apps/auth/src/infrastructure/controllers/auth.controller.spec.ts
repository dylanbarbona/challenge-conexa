import { Test, TestingModule } from '@nestjs/testing';
import { Observable, of } from 'rxjs';
import { faker } from '@faker-js/faker';
import { AuthController } from './auth.controller';
import {
  AUTH_SERVICE,
  IAuthService,
} from '@app/auth/domain/contracts/auth.service';
import { LoginUserDto } from '@app/auth/domain/dto/login-user.dto';
import { AccessTokenEntity } from '@app/auth/domain/entities/access.token';
import { RegisterUserDto } from '@app/auth/domain/dto/register-user.dto';
import { User } from '@app/user/domain/entities/user.entity';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<IAuthService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
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

    authController = app.get(AuthController);
    authService = app.get(AUTH_SERVICE);
  });

  describe('login', () => {
    let loginUserDto: LoginUserDto;
    let mockAccessToken: AccessTokenEntity;

    beforeEach(() => {
      loginUserDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      } as LoginUserDto;

      mockAccessToken = {
        access_token: faker.internet.password(),
      } as AccessTokenEntity;
    });

    it('should return an access token on successful login', async () => {
      // Arrange
      authService.login.mockReturnValueOnce(of(mockAccessToken));

      // Act
      const result = authController.login(loginUserDto);

      // Assert
      expect(authService.login).toHaveBeenCalled();
      expect(authService.login).toHaveBeenCalledWith(loginUserDto);
      expect(result).toBeInstanceOf(Observable);
      result.subscribe((accessToken) =>
        expect(accessToken).toEqual(mockAccessToken),
      );
    });
  });

  describe('register', () => {
    let registerUserDto: RegisterUserDto;
    let mockAccessToken: AccessTokenEntity;

    beforeEach(() => {
      registerUserDto = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      } as RegisterUserDto;

      mockAccessToken = {
        access_token: faker.internet.password(),
      } as AccessTokenEntity;
    });

    it('should return an access token on successful registration', () => {
      // Arrange
      authService.register.mockReturnValueOnce(of(mockAccessToken));

      // Act
      const result: Observable<AccessTokenEntity> =
        authController.register(registerUserDto);

      // Assert
      expect(authService.register).toHaveBeenCalled();
      expect(authService.register).toHaveBeenCalledWith(registerUserDto);
      expect(result).toBeInstanceOf(Observable<AccessTokenEntity>);
    });
  });

  describe('whoAmI', () => {
    let accessToken: AccessTokenEntity;
    let expectedUserData: User;

    beforeEach(() => {
      accessToken = {
        access_token: faker.internet.password(),
      } as AccessTokenEntity;
      expectedUserData = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      } as User;
    });

    it('should call authService.whoAmI() when whoAmI is called', () => {
      // Arrange
      authService.whoAmI.mockReturnValueOnce(of(expectedUserData));

      // Act
      const result: Observable<any> = authController.whoAmI(accessToken);

      // Assert
      expect(authService.whoAmI).toHaveBeenCalledWith(accessToken);
      expect(result).toBeInstanceOf(Observable<AccessTokenEntity>);
    });
  });
});
