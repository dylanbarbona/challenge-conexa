import {
  Aggregate,
  ClientSession,
  FilterQuery,
  ProjectionType,
  QueryOptions,
  SaveOptions,
  UpdateQuery,
} from 'mongoose';
import { Entity } from '@app/shared/repository/entity';

export interface IRepository<T extends Entity> {
  search(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions,
  ): Promise<any[]>;

  findById(id: string): Promise<any>;

  findOne(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions,
  ): Promise<any>;

  create(document: any, projection?: any, options?: any): Promise<any>;

  createMany(items: T[]): Promise<T[]>;

  updateById(
    id: any,
    update: UpdateQuery<T>,
    options: QueryOptions<T>,
  ): Promise<any>;

  updateMany(
    filter?: FilterQuery<T>,
    update?: UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<any>;

  upsert(
    filter?: FilterQuery<T>,
    update?: UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<any>;

  deleteById(id: string): Promise<any>;

  deleteMany(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: SaveOptions,
  ): Promise<any>;

  beginTransaction(): Promise<ClientSession>;

  commitTransaction(session?: ClientSession): Promise<any>;

  abortTransaction(session?: ClientSession): Promise<any>;

  aggregate(pipelines: any[]): Promise<Aggregate<any[]>>;
}
