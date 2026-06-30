import {
  Injectable, ConflictException, UnauthorizedException, BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async register(dto: RegisterDto, file?: Express.Multer.File) {
    const emailExists = await this.usersService.findByEmail(dto.email);
    if (emailExists) throw new ConflictException('El email ya está registrado');

    const usernameExists = await this.usersService.findByUsername(dto.username);
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

    const user = await this.usersService.create({
      ...dto,
      password: hashedPassword,
      fotoPerfil,
    });

    const { password, ...userData } = user.toObject();
    return { message: 'Usuario registrado exitosamente', user: userData };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    // LOGS TEMPORALES
    console.log('Password ingresada:', dto.password);
    console.log('Password en DB:', user.password);
    console.log('¿Empieza con $2b?:', user.password?.startsWith('$2b'));

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { sub: user._id, email: user.email, rol: user.rol };
    const token = this.jwtService.sign(payload);

    const { password, ...userData } = user.toObject();
    return { token, user: userData };
  }

  async autorizar(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findByEmail(payload.email);
      if (!user) throw new UnauthorizedException('Usuario no encontrado');
      const { password, ...userData } = user.toObject();
      return userData;
    } catch {
      throw new UnauthorizedException('Token invalido o expirado');
    }
  }
  
  async refrescar(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const newToken = this.jwtService.sign({
        sub: payload.sub,
        email: payload.email,
        rol: payload.rol,
      });
      return { token: newToken };
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}