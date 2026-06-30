import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: Types.ObjectId, ref: 'Post', required: true }) postId!: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) autor!: Types.ObjectId;
  @Prop({ required: true }) mensaje!: string;
  @Prop({ default: false }) modificado!: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);