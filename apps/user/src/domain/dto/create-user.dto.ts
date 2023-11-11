import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '@app/auth/domain/entities/role.entity';

export class CreateUserDto {
  _id?: string;

  @ApiProperty({ required: true, example: 'Dylan' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  firstName: string;

  @ApiProperty({ required: true, example: 'Barbona' })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @MaxLength(100, {
    message: 'El apellido no puede tener más de 100 caracteres',
  })
  lastName: string;

  @ApiProperty({ required: true, example: 'dylanbarbona97@gmail.com' })
  @IsString({ message: 'El correo electrónico debe ser una cadena de texto' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @ApiProperty({ required: true, example: '12345678' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(100, {
    message: 'La contraseña no puede tener más de 100 caracteres',
  })
  password: string;

  @ApiProperty({
    required: false,
    example: [Role.Administrator],
    default: [Role.Regular],
  })
  @IsOptional()
  @IsEnum(Role, {
    each: true,
    message: 'Los roles validos son Administrator o Regular',
  })
  roles?: Role[];
}
