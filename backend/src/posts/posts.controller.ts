import {
  Controller, Get, Post, Delete, Body, Param, Query,
  UseGuards, Request, UseInterceptors, UploadedFile, HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
@UseGuards(AuthGuard('jwt'))
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen', { storage: memoryStorage() }))
  create(
    @Body() dto: CreatePostDto,
    @Request() req: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.postsService.create(dto, req.user.userId, file);
  }

  @Get()
  findAll(
    @Query('orden') orden?: string,
    @Query('autorId') autorId?: string,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
  ) {
    return this.postsService.findAll({ orden, autorId, offset, limit });
  }

  @Get('mis-posts')
  misPosts(@Request() req: any) {
    return this.postsService.findByUser(req.user.userId, 3);
  }

  @Delete(':id')
  @HttpCode(200)
  delete(@Param('id') id: string, @Request() req: any) {
    return this.postsService.delete(id, req.user.userId, req.user.rol);
  }

  @Post(':id/like')
  @HttpCode(200)
  addLike(@Param('id') id: string, @Request() req: any) {
    return this.postsService.toggleLike(id, req.user.userId, 'add');
  }

  @Delete(':id/like')
  @HttpCode(200)
  removeLike(@Param('id') id: string, @Request() req: any) {
    return this.postsService.toggleLike(id, req.user.userId, 'remove');
  }
}