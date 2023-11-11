import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Types } from 'mongoose';
import { Role } from '@app/auth/domain/entities/role.entity';
import { Entity } from '@app/shared/repository/entity';

export class User extends Entity {
  @ApiProperty({ example: new Types.ObjectId() })
  _id: any;

  @ApiProperty({ example: 'Dylan' })
  firstName: string;

  @ApiProperty({ example: 'Barbona' })
  lastName: string;

  @ApiProperty({ example: 'dylanbarbona97@gmail.com' })
  email: string;

  @ApiProperty({ example: '12345678' })
  @Exclude({ toPlainOnly: true })
  password: string;

  @ApiProperty({ example: [Role.Administrator] })
  roles: Role[];

  @ApiProperty({ example: new Date() })
  createdAt: Date;

  @ApiProperty({ example: new Date() })
  updatedAt: Date;

  @ApiProperty({ example: null })
  deletedAt: Date;
}
