import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class FindByEmailDto {
  @ApiProperty({ required: true, example: 'dylanbarbona97@gmail.com' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsString({ message: 'El correo electrónico debe ser una cadena de texto' })
  email: string;

  @ApiProperty({ required: true, example: '12345678' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;
}
