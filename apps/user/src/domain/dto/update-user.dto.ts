import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from '@app/user/domain/dto/create-user.dto';
import { User } from '@app/user/domain/entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  auth: User;
  _id: string;
}
