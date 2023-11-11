/* eslint-disable @typescript-eslint/no-unused-vars */

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { from, map, mergeMap, Observable, of } from 'rxjs';
import { LoginUserDto } from '@app/auth/domain/dto/login-user.dto';
import { RegisterUserDto } from '@app/auth/domain/dto/register-user.dto';
import { handleRpcException } from '@app/shared/exception/handle-rpc.exception';
import { User } from '@app/user/domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenEntity } from '@app/auth/domain/entities/access.token';
import { IAuthService } from '@app/auth/domain/contracts/auth.service';
import {
  IUserService,
  USER_SERVICE,
} from '@app/user/domain/contracts/user.service';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: IUserService,
    private readonly jwtService: JwtService,
  ) {}

  login(input: LoginUserDto): Observable<AccessTokenEntity> {
    return this.loginUserByEmailAndPassword(input);
  }

  register(input: RegisterUserDto): Observable<AccessTokenEntity> {
    input.password = bcrypt.hashSync(input.password, 10);
    return this.registerUser(input);
  }

  whoAmI(input: AccessTokenEntity): Observable<User> {
    const decodedData = this.jwtService.decode(input.access_token) as any;
    if (!decodedData)
      throw new UnauthorizedException(
        'No está autorizado a realizar esta acción',
      );
    const { iat, exp, ...data } = decodedData;
    const user = new User(data);
    return of(user);
  }

  private loginUserByEmailAndPassword(
    input: LoginUserDto,
  ): Observable<AccessTokenEntity> {
    return this.userService.findByEmailAndPassword(input).pipe(
      handleRpcException,
      mergeMap((user: User) => this.generateAccessToken(user)),
    );
  }

  private registerUser(input: RegisterUserDto): Observable<AccessTokenEntity> {
    return this.userService.create(input).pipe(
      handleRpcException,
      mergeMap((user: User) => this.generateAccessToken(user)),
    );
  }

  private generateAccessToken(user: User): Observable<AccessTokenEntity> {
    const payload = { ...user };
    return from(this.jwtService.signAsync(payload)).pipe(
      map((access_token) => ({ access_token })),
    );
  }
}
