import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '@app/user/domain/dto/create-user.dto';

export class LoginUserDto extends PickType(CreateUserDto, [
  'email',
  'password',
] as const) {
  email: string;
  password: string;
}
