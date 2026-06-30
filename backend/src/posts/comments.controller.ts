import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';

@Controller('posts/:postId/comments')
@UseGuards(AuthGuard('jwt'))
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  @HttpCode(201)
  create(
    @Param('postId') postId: string,
    @Request() req: any,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.create(postId, req.user.userId, dto);
  }

  @Get()
  findAll(
    @Param('postId') postId: string,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
  ) {
    return this.commentsService.findByPost(postId, offset, limit);
  }

  @Put(':commentId')
  update(
    @Param('commentId') commentId: string,
    @Request() req: any,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentsService.update(commentId, req.user.userId, dto);
  }
}