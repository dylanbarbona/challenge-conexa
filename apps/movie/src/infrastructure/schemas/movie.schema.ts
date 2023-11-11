import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { Movie } from '@app/movie/domain/entities/movie.entity';

@Schema({ versionKey: false })
export class MovieDocument extends Movie {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: Number, unique: true })
  external_id: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  episode_id: number;

  @Prop({ required: true })
  opening_crawl: string;

  @Prop({ required: true })
  director: string;

  @Prop({ required: true })
  producer: string;

  @Prop({ required: true })
  release_date: string;

  @Prop({ required: true, type: [String] })
  characters: string[];

  @Prop({ required: true, type: [String] })
  planets: string[];

  @Prop({ required: true, type: [String] })
  starships: string[];

  @Prop({ required: true, type: [String] })
  vehicles: string[];

  @Prop({ required: true, type: [String] })
  species: string[];

  @Prop({ required: true })
  created: string;

  @Prop({ required: true })
  edited: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ default: null })
  deletedAt: Date;
}

export const MovieSchema = SchemaFactory.createForClass(MovieDocument);
