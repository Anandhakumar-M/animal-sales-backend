import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { timestamp } from 'rxjs';

@Schema()
export class Categories extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  image: string;

  @Prop()
  type: string;

  @Prop({ type: timestamp, default: Date.now() })
  createdAt: number;

  @Prop({ type: timestamp })
  updatedAt: number;
}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);
