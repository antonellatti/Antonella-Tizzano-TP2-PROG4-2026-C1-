import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true }) nombre!: string;
  @Prop({ required: true }) apellido!: string;
  @Prop({ required: true, unique: true }) email!: string;
  @Prop({ required: true, unique: true }) username!: string;
  @Prop({ required: true }) password!: string;
  @Prop() fechaNacimiento!: string;
  @Prop() descripcion!: string;
  @Prop({ default: '' }) fotoPerfil!: string;
  @Prop({ enum: ['usuario', 'administrador'], default: 'usuario' }) rol!: string;
  @Prop({ default: true }) activo!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);