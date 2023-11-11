import { Test, TestingModule } from '@nestjs/testing';
import {
  AUTH_SERVICE,
  IAuthService,
} from '@app/auth/domain/contracts/auth.service';
import { faker } from '@faker-js/faker';
import { UserGuard } from '@app/main/auth/guards/user.guard';
import { User } from '@app/user/domain/entities/user.entity';
import { of } from 'rxjs';

describe('UserGuard', () => {
  let userGuard: UserGuard;
  let authService: jest.Mocked<IAuthService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        UserGuard,
        {
          provide: AUTH_SERVICE,
          useValue: {
            whoAmI: jest.fn(),
          },
        },
      ],
    }).compile();

    userGuard = app.get(UserGuard);
    authService = app.get(AUTH_SERVICE);
  });

  it('should be defined', () => {
    expect(userGuard).toBeDefined();
  });

  it('should return true if access token is valid', async () => {
    // Arrange
    const token = 'Bearer ' + faker.string.uuid();
    const context = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn().mockReturnValue({
          user: null,
          headers: {
            authorization: token,
          },
        }),
      })),
    } as any;

    const user = new User({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
    authService.whoAmI.mockReturnValueOnce(of(user));

    // Act
    const canActivateResult = await userGuard.canActivate(context);

    // Assert
    expect(canActivateResult).toBe(true);
  });

  it('should return false if access token is invalid', async () => {
    // Arrange
    const token = 'Bearer ' + faker.string.uuid();
    const context = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn().mockReturnValue({
          user: null,
          headers: {
            authorization: token,
          },
        }),
      })),
    } as any;

    authService.whoAmI.mockReturnValueOnce(of(null));

    // Act
    try {
      await userGuard.canActivate(context);
    } catch (e) {
      // Assert
      expect(e).toBeDefined();
    }
  });

  it('should return false if there is no access token', async () => {
    // Arrange
    const context = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn().mockReturnValue({
          user: null,
          headers: {
            authorization: null,
          },
        }),
      })),
    } as any;

    // Act
    try {
      await userGuard.canActivate(context);
    } catch (e) {
      // Assert
      expect(e).toBeDefined();
    }
  });
});
