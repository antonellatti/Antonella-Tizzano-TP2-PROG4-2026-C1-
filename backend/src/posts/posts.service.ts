import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async create(dto: CreatePostDto, userId: string, file?: Express.Multer.File) {
    let imagen = '';
    if (file) {
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: 'red-social/posts' }, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }).end(file.buffer);
      });
      imagen = result.secure_url;
    }

    const post = await this.postModel.create({
      ...dto,
      imagen,
      autor: new Types.ObjectId(userId),
    });

    return post.populate('autor', '-password');
  }

  async findAll(query: {
    orden?: string;
    autorId?: string;
    offset?: number;
    limit?: number;
  }) {
    const { orden, autorId, offset = 0, limit = 10 } = query;

    const filter: any = { eliminado: false };
    if (autorId) filter.autor = new Types.ObjectId(autorId);

    const sort: any = orden === 'likes'
      ? { likesCount: -1 }
      : { createdAt: -1 };

    const posts = await this.postModel.aggregate([
      { $match: filter },
      { $addFields: { likesCount: { $size: '$likes' } } },
      { $sort: sort },
      { $skip: Number(offset) },
      { $limit: Number(limit) },
      {
        $lookup: {
          from: 'users',
          localField: 'autor',
          foreignField: '_id',
          as: 'autor',
          pipeline: [{ $project: { password: 0 } }],
        },
      },
      { $unwind: '$autor' },
    ]);

    const total = await this.postModel.countDocuments(filter);
    return { posts, total, offset, limit };
  }

  async delete(postId: string, userId: string, userRol: string) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Publicación no encontrada');
    if (post.eliminado) throw new NotFoundException('Publicación no encontrada');

    const esAutor = post.autor.toString() === userId;
    const esAdmin = userRol === 'administrador';
    if (!esAutor && !esAdmin) throw new ForbiddenException('No tenés permiso para eliminar esta publicación');

    post.eliminado = true;
    await post.save();
    return { message: 'Publicación eliminada correctamente' };
  }

  async toggleLike(postId: string, userId: string, action: 'add' | 'remove') {
    const post = await this.postModel.findById(postId);
    if (!post || post.eliminado) throw new NotFoundException('Publicación no encontrada');

    const userObjectId = new Types.ObjectId(userId);
    const yaLiked = post.likes.some(id => id.toString() === userId);

    if (action === 'add') {
      if (yaLiked) return { message: 'Ya le diste me gusta' };
      post.likes.push(userObjectId);
    } else {
      if (!yaLiked) throw new ForbiddenException('No le habías dado me gusta');
      post.likes = post.likes.filter(id => id.toString() !== userId);
    }

    await post.save();
    return post.populate('autor', '-password');
  }

  async findByUser(userId: string, limit = 3) {
    return this.postModel
      .find({ autor: new Types.ObjectId(userId), eliminado: false })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('autor', '-password');
  }
}