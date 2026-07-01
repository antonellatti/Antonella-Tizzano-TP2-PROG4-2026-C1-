import {
  Controller, Get, Post, Delete, Body, Param, UseGuards,
  UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AdminGuard } from '../auth/roles.guard';

@Controller('users')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @UseInterceptors(FileInterceptor('fotoPerfil', { storage: memoryStorage() }))
  create(@Body() dto: CreateUserDto, @UploadedFile() file?: Express.Multer.File) {
    return this.usersService.createByAdmin(dto, file);
  }

  @Delete(':id')
  deshabilitar(@Param('id') id: string) {
    return this.usersService.deshabilitar(id);
  }

  @Post(':id/habilitar')
  habilitar(@Param('id') id: string) {
    return this.usersService.habilitar(id);
  }
}