import {
  Body,
  Controller,
  Inject,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  IUserService,
  USER_SERVICE,
} from '@app/user/domain/contracts/user.service';
import { Observable } from 'rxjs';
import { User } from '@app/user/domain/entities/user.entity';
import { UpdateUserDto } from '@app/user/domain/dto/update-user.dto';
import { UserGuard } from '@app/main/auth/guards/user.guard';

@ApiTags('User')
@Controller({
  path: '/user',
  version: '1',
})
export class UserController {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: IUserService,
  ) {}

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @ApiAcceptedResponse({ type: User })
  update(
    @Req() req,
    @Param('id') _id: string,
    @Body() input: UpdateUserDto,
  ): Observable<User> {
    return this.userService.update(_id, { ...input, auth: req.user });
  }
}
