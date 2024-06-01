import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { timestamp } from 'rxjs';
import { User } from './user.schema';
import mongoose from 'mongoose';

export enum AssetType {
  Image = 'image',
  Video = 'video',
  Pdf = 'pdf',
}

export interface Asset {
  path: string;
  type: AssetType;
  order: number;
}

@Schema()
export class AssetSchema {
  @Prop({ required: true })
  path: string;

  @Prop({ required: true, enum: AssetType })
  type: string;

  @Prop({ required: true })
  order: number;
}

export enum QualityVerification {
  NOT_VERIFIED = 'notVerified',
  REQUESTED = 'requested',
  VERIFIED = 'verified',
}

@Schema()
export class SaleAnimal extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop({ required: true })
  type: string;

  @Prop({ type: [AssetSchema], required: true })
  assets: Asset[];

  @Prop({ required: true })
  lactation: number;

  @Prop({ required: true })
  currentMilk: number;

  @Prop({ required: true })
  maxMilk: number;

  @Prop({ required: true })
  price: number;

  @Prop({ default: false })
  isPriceNegotiable: boolean;

  @Prop()
  details: string;

  @Prop()
  location: string;

  @Prop({ enum: QualityVerification, default: 'notVerified' })
  qualityVerification: string;

  @Prop({ type: timestamp, default: Date.now() })
  createdAt: number;

  @Prop({
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  })
  expireAt: Date;

  @Prop({ type: timestamp })
  updatedAt: number;
}

export const SaleAnimalSchema = SchemaFactory.createForClass(SaleAnimal);
