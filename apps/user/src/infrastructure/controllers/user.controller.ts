import { Observable } from 'rxjs';
import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { User } from '@app/user/domain/entities/user.entity';
import { SearchUserDto } from '@app/user/domain/dto/search-user.dto';
import { FindByEmailDto } from '@app/user/domain/dto/find-by-email.dto';
import { CreateUserDto } from '@app/user/domain/dto/create-user.dto';
import { UpdateUserDto } from '@app/user/domain/dto/update-user.dto';
import { DeleteUserDto } from '@app/user/domain/dto/delete-user.dto';
import {
  IUserService,
  USER_CLIENT_CMD,
  USER_SERVICE,
} from '@app/user/domain/contracts/user.service';

@Controller()
export class UserController {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: IUserService,
  ) {}

  @MessagePattern({ cmd: USER_CLIENT_CMD.FIND })
  find(input: SearchUserDto): Observable<User[]> {
    return this.userService.find(input);
  }

  @MessagePattern({ cmd: USER_CLIENT_CMD.FIND_BY_ID })
  findById(input: { _id: string }): Observable<User> {
    return this.userService.findById(input._id);
  }

  @MessagePattern({ cmd: USER_CLIENT_CMD.FIND_BY_EMAIL_AND_PASSWORD })
  findByEmailAndPassword(input: FindByEmailDto): Observable<User> {
    return this.userService.findByEmailAndPassword(input);
  }

  @MessagePattern({ cmd: USER_CLIENT_CMD.CREATE })
  create(input: CreateUserDto): Observable<User> {
    return this.userService.create(input);
  }

  @MessagePattern({ cmd: USER_CLIENT_CMD.UPDATE })
  update(input: UpdateUserDto): Observable<User> {
    const { _id, ...data } = input;
    return this.userService.update(_id, data as UpdateUserDto);
  }

  @MessagePattern({ cmd: USER_CLIENT_CMD.DELETE })
  delete(input: DeleteUserDto): Observable<User> {
    return this.userService.delete(input);
  }
}
