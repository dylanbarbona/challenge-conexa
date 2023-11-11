import { RolesGuard } from './roles.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { Role } from '@app/auth/domain/entities/role.entity';
import { User } from '@app/user/domain/entities/user.entity';
import { faker } from '@faker-js/faker';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;
  let context;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    rolesGuard = app.get(RolesGuard);
    reflector = app.get(Reflector);
    context = {
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          user: new User({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            roles: [Role.Administrator],
          }),
        }),
      }),
    };
  });

  it('should be defined', () => {
    expect(rolesGuard).toBeDefined();
  });

  it('should return true if no roles are required', () => {
    // Arrange
    const requiredRoles = null;
    reflector.getAllAndOverride.mockReturnValueOnce(requiredRoles);

    // Act
    const canActivateResult = rolesGuard.canActivate(context);

    // Assert
    expect(canActivateResult).toBe(true);
  });

  it('should return true if user has required roles', () => {
    // Arrange
    const requiredRoles = [Role.Administrator];
    reflector.getAllAndOverride.mockReturnValueOnce(requiredRoles);

    // Act
    const canActivateResult = rolesGuard.canActivate(context);

    // Assert
    expect(canActivateResult).toBe(true);
  });

  it('should return false if user does not have required roles', () => {
    // Arrange
    const requiredRoles = [Role.Regular];
    reflector.getAllAndOverride.mockReturnValueOnce(requiredRoles);

    // Act
    try {
      rolesGuard.canActivate(context);
    } catch (e) {
      // Assert
      expect(e).toBeDefined();
    }
  });
});
