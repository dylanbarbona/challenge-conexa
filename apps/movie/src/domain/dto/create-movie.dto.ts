import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: 'El ID no puede estar vacío' })
  external_id: number;

  @ApiProperty({ example: 'A New Hope' })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El título no puede estar vacío' })
  @Length(1, 255, { message: 'El título no puede tener más de 255 caracteres' })
  title: string;

  @ApiProperty({ example: 4 })
  episode_id: number;

  @ApiProperty({
    example:
      "It is a period of civil war.\\r\\nRebel spaceships, striking\\r\\nfrom a hidden base, have won\\r\\ntheir first victory against\\r\\nthe evil Galactic Empire.\\r\\n\\r\\nDuring the battle, Rebel\\r\\nspies managed to steal secret\\r\\nplans to the Empire's\\r\\nultimate weapon, the DEATH\\r\\nSTAR, an armored space\\r\\nstation with enough power\\r\\nto destroy an entire planet.\\r\\n\\r\\nPursued by the Empire's\\r\\nsinister agents, Princess\\r\\nLeia races home aboard her\\r\\nstarship, custodian of the\\r\\nstolen plans that can save her\\r\\npeople and restore\\r\\nfreedom to the galaxy....\"",
  })
  @IsString({ message: 'La sinopsis debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La sinopsis no puede estar vacía' })
  @Length(1, 10000, {
    message: 'La sinopsis no puede tener más de 10000 caracteres',
  })
  opening_crawl: string;

  @ApiProperty({ example: 'George Lucas' })
  @IsString({ message: 'El director debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El director no puede estar vacío' })
  @Length(1, 255, {
    message: 'El director no puede tener más de 255 caracteres',
  })
  director: string;

  @ApiProperty({ example: 'Gary Kurtz, Rick McCallum' })
  @IsString({ message: 'El productor debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El productor no puede estar vacío' })
  @Length(1, 255, {
    message: 'El productor no puede tener más de 255 caracteres',
  })
  producer: string;

  @ApiProperty({ example: '1977-05-25' })
  @IsString({ message: 'La fecha de lanzamiento debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La fecha de lanzamiento no puede estar vacía' })
  release_date: string;

  @ApiProperty({
    example: [
      'https://swapi.dev/api/people/1/',
      'https://swapi.dev/api/people/2/',
      'https://swapi.dev/api/people/3/',
    ],
  })
  @IsNotEmpty({ message: 'La lista de personajes no puede estar vacía' })
  characters: string[];

  @ApiProperty({
    example: [
      'https://swapi.dev/api/planets/1/',
      'https://swapi.dev/api/planets/2/',
      'https://swapi.dev/api/planets/3/',
    ],
  })
  @IsNotEmpty({ message: 'La lista de planetas no puede estar vacía' })
  planets: string[];

  @ApiProperty({
    example: [
      'https://swapi.dev/api/starships/2/',
      'https://swapi.dev/api/starships/3/',
      'https://swapi.dev/api/starships/5/',
    ],
  })
  @IsNotEmpty({ message: 'La lista de naves estelares no puede estar vacía' })
  starships: string[];

  @ApiProperty({
    example: [
      'https://swapi.dev/api/vehicles/4/',
      'https://swapi.dev/api/vehicles/6/',
      'https://swapi.dev/api/vehicles/7/',
    ],
  })
  @IsNotEmpty({ message: 'La lista de vehículos no puede estar vacía' })
  vehicles: string[];

  @ApiProperty({
    example: [
      'https://swapi.dev/api/species/1/',
      'https://swapi.dev/api/species/2/',
      'https://swapi.dev/api/species/3/',
    ],
  })
  @IsNotEmpty({ message: 'La lista de especies no puede estar vacía' })
  species: string[];

  @ApiProperty({ example: '2014-12-10T14:23:31.880000Z' })
  @IsString({ message: 'La fecha de creación debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La fecha de creación no puede estar vacía' })
  created: string;

  @ApiProperty({ example: '2014-12-20T19:49:45.256000Z' })
  @IsString({ message: 'La fecha de edición debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La fecha de edición no puede estar vacía' })
  edited: string;

  @ApiProperty({ example: 'https://swapi.dev/api/films/1/' })
  @IsString({ message: 'La URL debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La URL no puede estar vacía' })
  url: string;
}
