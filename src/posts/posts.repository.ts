import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Post } from './entities/post.schema';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async getAmount() {
    return await this.postModel.countDocuments();
  }

  async get(page: number, limit: number): Promise<CreatePostDto[]> {
    const skip = (page - 1) * limit;

    const posts = await this.postModel
      .find()
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    return posts.map((post) => ({
      id: post._id,
      title: post.title,
      description: post.description,
      imageUrl: post.imageUrl,
      content: post.content,
      publishedAt: post.publishedAt,
    }));
  }

  async updateById(id: string, dto: UpdatePostDto) {
    const updatedArticle = await this.postModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    return updatedArticle;
  }

  async add(dto: CreatePostDto): Promise<Post> {
    const newArticle = await this.postModel.create(dto);

    return newArticle;
  }

  async getById(id: string): Promise<Post> {
    return await this.postModel.findById(id).exec();
  }

  async remove(id: string): Promise<void> {
    const deletedArticle = await this.postModel.findByIdAndDelete(id);

    return deletedArticle.id || null;
  }
}