import { Entity } from '@app/shared/repository/entity';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Exclude, Expose } from 'class-transformer';

export class Movie extends Entity {
  @ApiProperty({ example: 1 })
  @Exclude({ toPlainOnly: true })
  external_id: number;
  @ApiProperty({ example: 'A New Hope' })
  title: string;
  @ApiProperty({ example: 4 })
  episode_id: number;
  @ApiProperty({
    example:
      "It is a period of civil war.\\r\\nRebel spaceships, striking\\r\\nfrom a hidden base, have won\\r\\ntheir first victory against\\r\\nthe evil Galactic Empire.\\r\\n\\r\\nDuring the battle, Rebel\\r\\nspies managed to steal secret\\r\\nplans to the Empire's\\r\\nultimate weapon, the DEATH\\r\\nSTAR, an armored space\\r\\nstation with enough power\\r\\nto destroy an entire planet.\\r\\n\\r\\nPursued by the Empire's\\r\\nsinister agents, Princess\\r\\nLeia races home aboard her\\r\\nstarship, custodian of the\\r\\nstolen plans that can save her\\r\\npeople and restore\\r\\nfreedom to the galaxy....\"",
  })
  opening_crawl: string;
  @ApiProperty({ example: 'George Lucas' })
  director: string;
  @ApiProperty({ example: 'Gary Kurtz, Rick McCallum' })
  producer: string;
  @ApiProperty({ example: '1977-05-25' })
  release_date: string;
  @ApiProperty({
    example: [
      'https://swapi.dev/api/people/1/',
      'https://swapi.dev/api/people/2/',
      'https://swapi.dev/api/people/3/',
    ],
  })
  characters: string[];
  @ApiProperty({
    example: [
      'https://swapi.dev/api/planets/1/',
      'https://swapi.dev/api/planets/2/',
      'https://swapi.dev/api/planets/3/',
    ],
  })
  planets: string[];
  @ApiProperty({
    example: [
      'https://swapi.dev/api/starships/2/',
      'https://swapi.dev/api/starships/3/',
      'https://swapi.dev/api/starships/5/',
    ],
  })
  starships: string[];
  @ApiProperty({
    example: [
      'https://swapi.dev/api/vehicles/4/',
      'https://swapi.dev/api/vehicles/6/',
      'https://swapi.dev/api/vehicles/7/',
    ],
  })
  vehicles: string[];
  @ApiProperty({
    example: [
      'https://swapi.dev/api/species/1/',
      'https://swapi.dev/api/species/2/',
      'https://swapi.dev/api/species/3/',
    ],
  })
  species: string[];
  @ApiProperty({ example: '2014-12-10T14:23:31.880000Z' })
  created: string;
  @ApiProperty({ example: '2014-12-20T19:49:45.256000Z' })
  edited: string;
  @ApiProperty({ example: 'https://swapi.dev/api/films/1/' })
  url: string;
  @ApiProperty({ example: new Date() })
  createdAt: Date;
  @ApiProperty({ example: new Date() })
  updatedAt: Date;
  @ApiProperty({ example: null })
  deletedAt: Date;

  @ApiProperty({ example: new Types.ObjectId() })
  @Exclude({ toPlainOnly: true })
  _id: any;

  @Expose({ toPlainOnly: true })
  get id() {
    return this.external_id;
  }
}
