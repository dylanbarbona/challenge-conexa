import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AccessTokenEntity } from '@app/auth/domain/entities/access.token';
import { User } from '@app/user/domain/entities/user.entity';
import { Observable } from 'rxjs';
import { RegisterUserDto } from '@app/auth/domain/dto/register-user.dto';
import { LoginUserDto } from '@app/auth/domain/dto/login-user.dto';
import {
  AUTH_CLIENT,
  AUTH_CLIENT_CMD,
  IAuthService,
} from '@app/auth/domain/contracts/auth.service';

export class AuthProxy implements IAuthService {
  constructor(@Inject(AUTH_CLIENT) private readonly client: ClientProxy) {}

  login(input: LoginUserDto): Observable<AccessTokenEntity> {
    return this.client.send({ cmd: AUTH_CLIENT_CMD.LOGIN }, input);
  }

  register(input: RegisterUserDto): Observable<AccessTokenEntity> {
    return this.client.send({ cmd: AUTH_CLIENT_CMD.REGISTER }, input);
  }

  whoAmI(input: AccessTokenEntity): Observable<User> {
    return this.client.send({ cmd: AUTH_CLIENT_CMD.WHO_AM_I }, input);
  }
}
