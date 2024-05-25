import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({
    required: true,
    trim: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
  })
  userName: string;

  @Prop({
    required: true,
    trim: true,
    select: false,
    minlength: 8,
    maxlength: 32,
  })
  password: string;

  @Prop({ enum: ['customer', 'admin'], default: 'customer' })
  role: string;

  async checkPassword(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
  }
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.checkPassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  this as UserDocument;
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
