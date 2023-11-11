import { SearchUserDto } from '@app/user/domain/dto/search-user.dto';
import { CreateUserDto } from '@app/user/domain/dto/create-user.dto';
import { UpdateUserDto } from '@app/user/domain/dto/update-user.dto';
import { FindByEmailDto } from '@app/user/domain/dto/find-by-email.dto';
import { User } from '@app/user/domain/entities/user.entity';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
  search(input: SearchUserDto): Promise<User[]>;

  findById(id: string): Promise<User>;

  create(input: CreateUserDto): Promise<User>;

  updateById(id: string, input: UpdateUserDto): Promise<User>;

  deleteById(id: string): Promise<User>;

  findByEmailAndPassword(input: FindByEmailDto): Promise<User>;
}
