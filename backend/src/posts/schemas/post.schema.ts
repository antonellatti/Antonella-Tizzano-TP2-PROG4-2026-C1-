import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true }) titulo!: string;
  @Prop({ required: true }) descripcion!: string;
  @Prop({ default: '' }) imagen!: string;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) autor!: Types.ObjectId;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] }) likes!: Types.ObjectId[];
  @Prop({ default: false }) eliminado!: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);