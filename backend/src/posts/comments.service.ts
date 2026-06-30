import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

  async create(postId: string, userId: string, dto: CreateCommentDto) {
    const comment = await this.commentModel.create({
      postId: new Types.ObjectId(postId),
      autor: new Types.ObjectId(userId),
      mensaje: dto.mensaje,
    });
    return comment.populate('autor', '-password');
  }

  async findByPost(postId: string, offset = 0, limit = 5) {
    const filter = { postId: new Types.ObjectId(postId) };
    const comments = await this.commentModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(Number(offset))
      .limit(Number(limit))
      .populate('autor', '-password');
    const total = await this.commentModel.countDocuments(filter);
    return { comments, total, offset, limit };
  }

  async update(commentId: string, userId: string, dto: UpdateCommentDto) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comentario no encontrado');
    if (comment.autor.toString() !== userId) throw new ForbiddenException('No podés editar este comentario');
    comment.mensaje = dto.mensaje;
    comment.modificado = true;
    await comment.save();
    return comment.populate('autor', '-password');
  }
}