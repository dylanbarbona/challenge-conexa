import { Observable } from 'rxjs';
import { User } from '@app/user/domain/entities/user.entity';

import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateUserDto } from '@app/user/domain/dto/update-user.dto';
import { FindByEmailDto } from '@app/user/domain/dto/find-by-email.dto';
import { SearchUserDto } from '@app/user/domain/dto/search-user.dto';
import { CreateUserDto } from '@app/user/domain/dto/create-user.dto';
import { DeleteUserDto } from '@app/user/domain/dto/delete-user.dto';
import {
  IUserService,
  USER_CLIENT,
  USER_CLIENT_CMD,
} from '@app/user/domain/contracts/user.service';

export class UserProxy implements IUserService {
  constructor(@Inject(USER_CLIENT) private readonly client: ClientProxy) {}

  find(input: SearchUserDto): Observable<User[]> {
    return this.client.send({ cmd: USER_CLIENT_CMD.FIND }, input);
  }

  findByEmailAndPassword(input: FindByEmailDto): Observable<User> {
    return this.client.send(
      { cmd: USER_CLIENT_CMD.FIND_BY_EMAIL_AND_PASSWORD },
      input,
    );
  }

  findById(_id: string): Observable<User> {
    return this.client.send({ cmd: USER_CLIENT_CMD.FIND_BY_ID }, { _id });
  }

  create(input: CreateUserDto): Observable<User> {
    return this.client.send({ cmd: USER_CLIENT_CMD.CREATE }, input);
  }

  update(_id: string, input: UpdateUserDto): Observable<User> {
    return this.client.send({ cmd: USER_CLIENT_CMD.UPDATE }, { ...input, _id });
  }

  delete(input: DeleteUserDto): Observable<User> {
    return this.client.send({ cmd: USER_CLIENT_CMD.DELETE }, input);
  }
}
