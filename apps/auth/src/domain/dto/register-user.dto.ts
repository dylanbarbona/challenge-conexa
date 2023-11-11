import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '@app/user/domain/dto/create-user.dto';

export class RegisterUserDto extends PickType(CreateUserDto, [
  'firstName',
  'lastName',
  'email',
  'password',
] as const) {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
