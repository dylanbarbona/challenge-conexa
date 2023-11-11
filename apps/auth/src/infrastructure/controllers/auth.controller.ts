import { Controller, Inject } from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { Observable } from 'rxjs';
import { MessagePattern } from '@nestjs/microservices';
import { LoginUserDto } from '@app/auth/domain/dto/login-user.dto';
import { RegisterUserDto } from '@app/auth/domain/dto/register-user.dto';
import { AccessTokenEntity } from '@app/auth/domain/entities/access.token';
import {
  AUTH_CLIENT_CMD,
  AUTH_SERVICE,
} from '@app/auth/domain/contracts/auth.service';

@Controller()
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
  ) {}

  @MessagePattern({ cmd: AUTH_CLIENT_CMD.LOGIN })
  login(input: LoginUserDto): Observable<AccessTokenEntity> {
    return this.authService.login(input);
  }

  @MessagePattern({ cmd: AUTH_CLIENT_CMD.REGISTER })
  register(input: RegisterUserDto): Observable<AccessTokenEntity> {
    return this.authService.register(input);
  }

  @MessagePattern({ cmd: AUTH_CLIENT_CMD.WHO_AM_I })
  whoAmI(input: AccessTokenEntity) {
    return this.authService.whoAmI(input);
  }
}
