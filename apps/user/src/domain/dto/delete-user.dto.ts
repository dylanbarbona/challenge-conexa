import { User } from '@app/user/domain/entities/user.entity';

export class DeleteUserDto {
  auth: User;
  _id: string;
}
