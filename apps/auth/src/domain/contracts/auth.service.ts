import { LoginUserDto } from '@app/auth/domain/dto/login-user.dto';
import { Observable } from 'rxjs';
import { AccessTokenEntity } from '@app/auth/domain/entities/access.token';
import { RegisterUserDto } from '@app/auth/domain/dto/register-user.dto';
import { User } from '@app/user/domain/entities/user.entity';

export const AUTH_CLIENT = 'AUTH_CLIENT';
export const AUTH_SERVICE = 'AUTH_SERVICE';

export enum AUTH_CLIENT_CMD {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  WHO_AM_I = 'WHO_AM_I',
}

export interface IAuthService {
  login(input: LoginUserDto): Observable<AccessTokenEntity>;

  register(input: RegisterUserDto): Observable<AccessTokenEntity>;

  whoAmI(input: AccessTokenEntity): Observable<User>;
}
