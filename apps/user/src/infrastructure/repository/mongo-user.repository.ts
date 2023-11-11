import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@app/shared/repository/base.repository';
import { IUserRepository } from '@app/user/domain/contracts/user.repository';
import { User } from '@app/user/domain/entities/user.entity';
import { UserDocument } from '@app/user/infrastructure/schemas/user.schema';
import { FindByEmailDto } from '@app/user/domain/dto/find-by-email.dto';
import { CreateUserDto } from '@app/user/domain/dto/create-user.dto';
import { UpdateUserDto } from '@app/user/domain/dto/update-user.dto';
import { SearchUserDto } from '@app/user/domain/dto/search-user.dto';
import { USER_DATABASE } from '@app/user/user.module';

import * as bcrypt from 'bcrypt';

@Injectable()
export class MongoUserRepository<T extends UserDocument>
  extends BaseRepository<T>
  implements IUserRepository
{
  constructor(
    @InjectModel(User.name, USER_DATABASE)
    protected readonly model: Model<T>,
    @InjectConnection(USER_DATABASE) protected readonly connection: Connection,
  ) {
    super();
  }

  async findById(id: string): Promise<User> {
    const user = await super.findById(id);
    return new User(user);
  }

  async findByEmailAndPassword(input: FindByEmailDto): Promise<User> {
    const user = await super.findOne({ email: input.email });
    if (!user) throw new NotFoundException('El usuario no existe');
    if (!bcrypt.compareSync(input.password, user.password))
      throw new UnauthorizedException('Usuario y contraseña incorrectos');
    return new User(user);
  }

  async create(input: CreateUserDto): Promise<User> {
    const user = await super.create(input);
    return new User(user);
  }

  async search(input: SearchUserDto): Promise<User[]> {
    const regex = new RegExp(input.query, 'i');
    const users = await super.search(
      {
        $or: [
          {
            firstName: { $regex: regex },
          },
          {
            lastName: { $regex: regex },
          },
          {
            email: { $regex: regex },
          },
        ],
      },
      {},
      {
        limit: input.limit,
        skip: input.skip,
      },
    );

    return users.map((user) => new User(user));
  }

  async updateById(id: string, input: UpdateUserDto): Promise<User> {
    const user = await super.updateById(id, {
      ...input,
      updatedAt: new Date(),
    });
    return new User(user);
  }

  async deleteById(id: string): Promise<User> {
    const user = await super.updateById(
      id,
      { deletedAt: new Date() },
      { new: true },
    );
    return new User(user);
  }
}
