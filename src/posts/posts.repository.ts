import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Post } from './entities/post.schema';

import { CreatePostDto } from './dto/create-post.dto';
import { PostSummaryDto } from './dto/post-summary.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async getAmount(): Promise<number> {
    return await this.postModel.countDocuments();
  }

  async get(page: number, limit: number): Promise<PostSummaryDto[]> {
    const skip = (page - 1) * limit;

    const posts = await this.postModel
      .find({}, { content: 0 })
      .skip(skip)
      .limit(limit)
      .sort({ publishedAt: -1 })
      .lean()
      .exec();

    return posts.map((post) => ({
      id: post._id,
      title: post.title,
      description: post.description,
      imageUrl: post.imageUrl,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
    }));
  }

  async updateById(id: string, dto: UpdatePostDto) {
    const updatedArticle = await this.postModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updatedArticle) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return updatedArticle;
  }

  async add(dto: CreatePostDto): Promise<Post> {
    const newArticle = await this.postModel.create(dto);

    return newArticle;
  }

  async getById(id: string): Promise<Post> {
    const post = await this.postModel.findOne({ _id: id }).lean().exec();

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    const { _id, ...rest } = post;

    return { id: _id, ...rest };
  }

  async remove(id: string): Promise<Post | null> {
    return await this.postModel.findByIdAndDelete(id);
  }
}
