import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchMovieDto {
  @ApiProperty({
    example: 'A New Hope',
    description: 'Texto de búsqueda',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El campo query debe ser una cadena de texto' })
  query?: string;

  @ApiProperty({
    example: 10,
    default: 10,
    description: 'Número máximo de resultados a devolver',
    required: false,
  })
  @IsOptional()
  @Transform((value) => Number(value.value))
  @IsInt({ message: 'El campo limit debe ser un número entero' })
  @Min(0, { message: 'El campo limit no puede ser menor que 0' })
  limit?: number = 10;

  @ApiProperty({
    example: 0,
    default: 0,
    description: 'Número de resultados a omitir al paginar',
    required: false,
  })
  @IsOptional()
  @Transform((value) => Number(value.value))
  @IsInt({ message: 'El campo skip debe ser un número entero' })
  @Min(0, { message: 'El campo skip no puede ser menor que 0' })
  skip?: number = 0;
}
