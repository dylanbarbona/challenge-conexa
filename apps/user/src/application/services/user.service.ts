import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@app/user/domain/entities/user.entity';

import {
  IUserRepository,
  USER_REPOSITORY,
} from '@app/user/domain/contracts/user.repository';
import { from, Observable } from 'rxjs';
import { CreateUserDto } from '@app/user/domain/dto/create-user.dto';
import { SearchUserDto } from '@app/user/domain/dto/search-user.dto';
import { UpdateUserDto } from '@app/user/domain/dto/update-user.dto';
import { FindByEmailDto } from '@app/user/domain/dto/find-by-email.dto';
import { DeleteUserDto } from '@app/user/domain/dto/delete-user.dto';
import { IUserService } from '@app/user/domain/contracts/user.service';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  find(input: SearchUserDto): Observable<User[]> {
    return from(this.userRepository.search(input));
  }

  findById(id: string): Observable<User> {
    return from(this.userRepository.findById(id));
  }

  findByEmailAndPassword(input: FindByEmailDto): Observable<User> {
    return from(this.userRepository.findByEmailAndPassword(input));
  }

  create(input: CreateUserDto): Observable<User> {
    return from(this.userRepository.create(input));
  }

  update(_id: string, input: UpdateUserDto): Observable<User> {
    const { auth, ...data } = input;
    if (auth._id !== _id)
      throw new UnauthorizedException(
        'No está autorizado a realizar esta acción',
      );
    return from(this.userRepository.updateById(_id, data as UpdateUserDto));
  }

  delete(input: DeleteUserDto): Observable<User> {
    const { _id, auth } = input;
    if (auth._id !== _id)
      throw new UnauthorizedException(
        'No está autorizado a realizar esta acción',
      );
    return from(this.userRepository.deleteById(_id));
  }
}
