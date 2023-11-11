import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { User } from '@app/user/domain/entities/user.entity';
import { Role } from '@app/auth/domain/entities/role.entity';

@Schema({ versionKey: false })
export class UserDocument extends User {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    default: [Role.Regular],
    type: [{ type: String, enum: Object.values(Role) }],
  })
  roles: Role[];

  @Prop({ required: false, default: new Date() })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt: Date;

  @Prop({ required: false })
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
