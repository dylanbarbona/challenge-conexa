import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  Aggregate,
  ClientSession,
  Connection,
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  SaveOptions,
  Types,
  UpdateQuery,
} from 'mongoose';
import { Entity } from '@app/shared/repository/entity';
import { IRepository } from '@app/shared/repository/repository.interface';

export abstract class BaseRepository<T extends Entity>
  implements IRepository<T>
{
  protected readonly model: Model<T>;
  protected readonly connection: Connection;

  async findById(id: string): Promise<any> {
    const item = await this.model.findById(id);
    if (!item) throw new NotFoundException();
    return item['_doc'];
  }

  async findOne(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions,
  ): Promise<any> {
    const item = await this.model.findOne(filter, projection, options);
    if (!item) throw new NotFoundException();
    return item['_doc'];
  }

  async search(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions,
  ): Promise<any> {
    return this.model.find(filter, projection, options);
  }

  async create(
    document: any,
    projection?: any,
    options?: SaveOptions,
  ): Promise<any> {
    const item = await new this.model(
      {
        ...document,
        _id: new Types.ObjectId(),
      },
      projection,
      options,
    );
    const saved = await item?.save();
    if (saved) return item;
    else throw new InternalServerErrorException();
  }

  async createMany(items: T[]): Promise<any[]> {
    return await this.model.insertMany(items);
  }

  async updateById(
    _id: any,
    update?: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<any> {
    if (typeof _id === 'string') {
      _id = new Types.ObjectId(_id);
    }
    const item = await this.findById(_id);
    if (!item) throw new NotFoundException();
    return this.model.findByIdAndUpdate({ _id }, update, {
      new: true,
      options,
    });
  }

  async updateMany(
    filter?: FilterQuery<T>,
    update?: UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<any> {
    return this.model.updateMany(filter, update, { new: true, options }).exec();
  }

  async upsert(
    filter?: FilterQuery<T>,
    update?: UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<any> {
    return await this.model
      .updateMany(filter, update, { new: true, upsert: true, ...options })
      .exec();
  }

  async deleteById(id: string): Promise<any> {
    const item = await this.findById(id);
    if (!item) throw new NotFoundException();
    return this.model.findByIdAndDelete(id);
  }

  async deleteMany(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: SaveOptions,
  ): Promise<any> {
    return this.model.deleteMany(filter, options).exec();
  }

  async aggregate(pipelines: any[]): Promise<Aggregate<any>> {
    return this.model.aggregate(pipelines);
  }

  async beginTransaction(): Promise<ClientSession> {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }

  async abortTransaction(session?: ClientSession): Promise<any> {
    return await session.abortTransaction();
  }

  async commitTransaction(session?: ClientSession): Promise<any> {
    return await session.commitTransaction();
  }
}
