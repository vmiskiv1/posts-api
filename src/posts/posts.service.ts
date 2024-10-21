import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async getAmountPosts() {
    return await this.postsRepository.getAmount();
  }

  async get(page: number, limit: number): Promise<CreatePostDto[]> {
    return await this.postsRepository.get(page, limit);
  }

  async add(dto: CreatePostDto) {
    return await this.postsRepository.add(dto);
  }

  async getById(id: string) {
    const foundedArticle = await this.postsRepository.getById(id);

    if (!foundedArticle) {
      throw new NotFoundException('Article not found');
    }

    return foundedArticle;
  }

  async updateById(id: string, dto: UpdatePostDto) {
    const updatedArticle = await this.postsRepository.updateById(id, dto);

    return updatedArticle;
  }

  remove(id: string) {
    return this.postsRepository.remove(id);
  }
}
