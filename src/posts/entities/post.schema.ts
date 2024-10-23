import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Post extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  imageUrl?: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  content?: string;

  @Prop({ required: false })
  publishedAt?: string;

  @Prop({ required: false })
  updatedAt?: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
