import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AUTH_SERVICE,
  IAuthService,
} from '@app/auth/domain/contracts/auth.service';

export class UserGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: IAuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const access_token = req.headers['authorization']?.split(' ')[1];

    if (!access_token)
      throw new UnauthorizedException(
        'No está autorizado a realizar esta acción',
      );

    try {
      req.access_token = access_token;
      const user = await this.authService.whoAmI({ access_token }).toPromise();
      if (!user)
        throw new UnauthorizedException(
          'No está autorizado a realizar esta acción',
        );
      req.user = user;
      return true;
    } catch (err) {
      throw new UnauthorizedException(
        'No está autorizado a realizar esta acción',
      );
    }
  }
}
