import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { LoginUserDto } from '@app/auth/domain/dto/login-user.dto';
import { User } from '@app/user/domain/entities/user.entity';
import { RegisterUserDto } from '@app/auth/domain/dto/register-user.dto';
import { AccessTokenEntity } from '@app/auth/domain/entities/access.token';
import { UserGuard } from './guards/user.guard';
import {
  AUTH_SERVICE,
  IAuthService,
} from '@app/auth/domain/contracts/auth.service';

@ApiTags('Auth')
@Controller({
  path: '/auth',
  version: '1',
})
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: IAuthService,
  ) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiAcceptedResponse({ type: AccessTokenEntity })
  login(@Body() input: LoginUserDto): Observable<AccessTokenEntity> {
    return this.authService.login(input);
  }

  @Post('/register')
  @ApiOperation({ summary: 'Registro' })
  @ApiCreatedResponse({ type: AccessTokenEntity })
  register(@Body() input: RegisterUserDto): Observable<AccessTokenEntity> {
    return this.authService.register(input);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener usuario' })
  @ApiAcceptedResponse({ type: User })
  @UseGuards(UserGuard)
  @Get('/')
  whoAmI(@Req() req): Observable<User> | User {
    return req.user;
  }
}
