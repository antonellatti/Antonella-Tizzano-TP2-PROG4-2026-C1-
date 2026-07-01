import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async create(data: Partial<User>): Promise<UserDocument> {
    return this.userModel.create(data);
  }

  async findAll() {
    return this.userModel.find().select('-password').sort({ createdAt: -1 });
  }

  async createByAdmin(dto: CreateUserDto, file?: Express.Multer.File) {
    const emailExists = await this.findByEmail(dto.email);
    if (emailExists) throw new ConflictException('El email ya está registrado');

    const usernameExists = await this.findByUsername(dto.username);
    if (usernameExists) throw new ConflictException('El nombre de usuario ya está en uso');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    let fotoPerfil = '';
    if (file) {
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: 'red-social/perfiles' }, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }).end(file.buffer);
      });
      fotoPerfil = result.secure_url;
    }

    const user = await this.create({
      ...dto,
      password: hashedPassword,
      fotoPerfil,
    });

    const { password, ...userData } = user.toObject();
    return userData;
  }

  async deshabilitar(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    user.activo = false;
    await user.save();
    return { message: 'Usuario deshabilitado correctamente' };
  }

  async habilitar(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    user.activo = true;
    await user.save();
    return { message: 'Usuario habilitado correctamente' };
  }
}