import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';
import { timestamp } from 'rxjs';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: [true, 'This mobile is already use'] })
  mobile: string;

  @Prop()
  mobileVerificationToken: string;

  @Prop()
  mobileVerification: boolean;

  @Prop({ type: timestamp })
  mobileChangedAt: number;

  @Prop({ unique: [true, 'This email is already use'] })
  email: string;

  @Prop()
  emailVerificationToken: string;

  @Prop()
  emailVerification: boolean;

  @Prop({ type: timestamp })
  emailChangedAt: number;

  @Prop()
  image: string;

  @Prop()
  language: string;

  @Prop()
  location: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  passwordResetToken: string;

  @Prop({ type: timestamp })
  passwordChangedAt: number;

  @Prop({ type: timestamp, default: Date.now() })
  createdAt: number;

  @Prop({ type: timestamp })
  updatedAt: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  //password is save has encrypt
  this.password = await bcrypt.hash(this.password, 10);

  // Convert timestamp to seconds
  if (this.passwordChangedAt) {
    this.passwordChangedAt = Math.floor(this.passwordChangedAt / 1000);
  }

  next();
});
