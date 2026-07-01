import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Comment, CommentDocument } from './schemas/comment.schema';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  private buildDateFilter(desde?: string, hasta?: string) {
    const filter: any = {};
    if (desde || hasta) {
      filter.createdAt = {};
      if (desde) filter.createdAt.$gte = new Date(desde);
      if (hasta) filter.createdAt.$lte = new Date(hasta);
    }
    return filter;
  }

  async postsPorUsuario(desde?: string, hasta?: string) {
    const dateFilter = this.buildDateFilter(desde, hasta);
    return this.postModel.aggregate([
      { $match: { eliminado: false, ...dateFilter } },
      {
        $lookup: {
          from: 'users',
          localField: 'autor',
          foreignField: '_id',
          as: 'autorInfo',
        },
      },
      { $unwind: '$autorInfo' },
      {
        $group: {
          _id: '$autor',
          username: { $first: '$autorInfo.username' },
          cantidad: { $sum: 1 },
        },
      },
      { $sort: { cantidad: -1 } },
    ]);
  }

  async comentariosPorFecha(desde?: string, hasta?: string) {
    const dateFilter = this.buildDateFilter(desde, hasta);
    return this.commentModel.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          cantidad: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  async comentariosPorPost(desde?: string, hasta?: string) {
    const dateFilter = this.buildDateFilter(desde, hasta);
    return this.commentModel.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$postId',
          cantidad: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: '_id',
          as: 'postInfo',
        },
      },
      { $unwind: '$postInfo' },
      {
        $project: {
          titulo: '$postInfo.titulo',
          cantidad: 1,
        },
      },
      { $sort: { cantidad: -1 } },
    ]);
  }
}