import {
  Controller, Post, Body, UploadedFile, UseInterceptors, HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('fotoPerfil', { storage: memoryStorage() }))
  register(@Body() dto: RegisterDto, @UploadedFile() file?: Express.Multer.File) {
    return this.authService.register(dto, file);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}