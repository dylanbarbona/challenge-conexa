import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MaxLength, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchUserDto {
  @ApiProperty({ required: false, example: 'Dylan' })
  @IsString({ message: 'La consulta debe ser una cadena de texto' })
  @MaxLength(100, {
    message: 'La consulta no puede tener más de 100 caracteres',
  })
  query: string;

  @ApiProperty({ required: false, example: 1, default: 0 })
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @IsNumber({}, { message: 'El límite debe ser un número' })
  @Min(0, { message: 'El límite no puede ser menor que 0' })
  limit: number;

  @ApiProperty({ required: false, example: 10, default: 10 })
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @IsNumber({}, { message: 'El salto debe ser un número' })
  @Min(0, { message: 'El salto no puede ser menor que 0' })
  skip: number;
}
