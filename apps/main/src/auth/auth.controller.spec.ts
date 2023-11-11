import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { AuthController } from '@app/main/auth/auth.controller';
import {
  AUTH_SERVICE,
  IAuthService,
} from '@app/auth/domain/contracts/auth.service';
import { LoginUserDto } from '@app/auth/domain/dto/login-user.dto';
import { RegisterUserDto } from '@app/auth/domain/dto/register-user.dto';
import { AccessTokenEntity } from '@app/auth/domain/entities/access.token';
import { User } from '@app/user/domain/entities/user.entity';
import { Observable, of } from 'rxjs';

describe('Main/AuthController', () => {
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

  it('login', () => {
    // Arrange
    const loginUserDto = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    } as LoginUserDto;
    authService.login.mockReturnValueOnce(
      of({ access_token: faker.string.uuid() }),
    );

    // Act
    const result = authController.login(loginUserDto);

    // Assert
    expect(authService.login).toHaveBeenCalledWith(loginUserDto);
    expect(result).toBeInstanceOf(Observable<AccessTokenEntity>);
  });

  it('register', () => {
    // Arrange
    const registerUserDto = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    } as RegisterUserDto;
    authService.register.mockReturnValueOnce(
      of({ access_token: faker.string.uuid() }),
    );

    // Act
    const result = authController.register(registerUserDto);

    // Assert
    expect(authService.register).toHaveBeenCalledWith(registerUserDto);
    expect(result).toBeInstanceOf(Observable<AccessTokenEntity>);
  });

  it('whoAmI', () => {
    // Arrange
    const req = {
      user: new User({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      }),
    };

    // Act
    const result = authController.whoAmI(req);

    // Assert
    expect(result).toBeInstanceOf(User);
  });
});
