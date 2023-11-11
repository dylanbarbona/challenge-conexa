import { Entity } from '@app/shared/repository/entity';
import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenEntity implements Entity {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI...',
  })
  access_token: string;
}
