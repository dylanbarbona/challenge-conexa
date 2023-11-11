import { Observable } from 'rxjs';
import { User } from '@app/user/domain/entities/user.entity';
import { SearchUserDto } from '@app/user/domain/dto/search-user.dto';
import { FindByEmailDto } from '@app/user/domain/dto/find-by-email.dto';
import { CreateUserDto } from '@app/user/domain/dto/create-user.dto';
import { UpdateUserDto } from '@app/user/domain/dto/update-user.dto';
import { DeleteUserDto } from '@app/user/domain/dto/delete-user.dto';

export const USER_CLIENT = 'USER_CLIENT';
export const USER_SERVICE = 'USER_SERVICE';

export enum USER_CLIENT_CMD {
  FIND = 'USER_FIND',
  FIND_BY_ID = 'USER_FIND_BY_ID',
  FIND_BY_EMAIL_AND_PASSWORD = 'USER_FIND_BY_EMAIL_AND_PASSWORD',
  CREATE = 'USER_CREATE',
  UPDATE = 'USER_UPDATE',
  DELETE = 'USER_DELETE',
}

export interface IUserService {
  find(input: SearchUserDto): Observable<User[]>;

  findById(id: string): Observable<User>;

  findByEmailAndPassword(input: FindByEmailDto): Observable<User>;

  create(input: CreateUserDto): Observable<User>;

  update(id: string, input: UpdateUserDto): Observable<User>;

  delete(input: DeleteUserDto): Observable<User>;
}
