import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostSummaryDto } from './dto/post-summary.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.schema';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async getAmount(): Promise<number> {
    return await this.postsRepository.getAmount();
  }

  async get(page: number, limit: number): Promise<PostSummaryDto[]> {
    return await this.postsRepository.get(page, limit);
  }

  async add(dto: CreatePostDto): Promise<Post> {
    return await this.postsRepository.add(dto);
  }

  async getById(id: string): Promise<Post> {
    return await this.postsRepository.getById(id);
  }

  async updateById(id: string, dto: UpdatePostDto): Promise<Post> {
    return await this.postsRepository.updateById(id, dto);
  }

  async remove(id: string): Promise<Post | null> {
    return await this.postsRepository.remove(id);
  }
}
