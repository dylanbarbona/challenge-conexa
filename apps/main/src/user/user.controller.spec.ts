import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from '@app/main/user/user.controller';
import {
  IUserService,
  USER_SERVICE,
} from '@app/user/domain/contracts/user.service';
import { AUTH_SERVICE } from '@app/auth/domain/contracts/auth.service';
import { User } from '@app/user/domain/entities/user.entity';
import { faker } from '@faker-js/faker';
import { UpdateUserDto } from '@app/user/domain/dto/update-user.dto';
import { of } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

describe('Main/UserController', () => {
  let userController: UserController;
  let userService: jest.Mocked<IUserService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: USER_SERVICE,
          useValue: {
            update: jest.fn(),
          },
        },
        {
          provide: AUTH_SERVICE,
          useValue: {
            whoAmI: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = app.get(UserController);
    userService = app.get(USER_SERVICE);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('update', () => {
    it('should update user and return updated user', async () => {
      // Arrange
      const _id = faker.string.uuid();
      const previousUser = new User({
        _id,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
      });

      const updatedUser = {
        ...previousUser,
        lastName: faker.person.lastName(),
      } as unknown as UpdateUserDto;

      const req = {
        user: previousUser,
      };

      userService.update.mockReturnValueOnce(
        of({ ...previousUser, ...updatedUser }),
      );

      // Act
      const result = userController.update(req, _id, updatedUser);

      // Assert
      expect(userService.update).toHaveBeenCalledWith(_id, {
        ...updatedUser,
        auth: req.user,
      });

      result.subscribe((res) => expect(res).toEqual(updatedUser));
    });

    it('should handle errors during update', async () => {
      // Arrange
      const _id = faker.string.uuid();
      const previousUser = new User({
        _id,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
      });

      const updatedUser = {
        ...previousUser,
        lastName: faker.person.lastName(),
      } as unknown as UpdateUserDto;

      const req = {
        user: previousUser,
      };

      userService.update.mockRejectedValueOnce(
        new NotFoundException() as never,
      );

      // Act
      const result = userController.update(req, _id, updatedUser);

      // Assert
      await expect(result).rejects.toThrowError(NotFoundException);
    });
  });
});
