import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Get paginated posts',
    description: 'Retrieve posts with pagination',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved posts',
    type: [CreatePostDto],
  })
  async getArticles(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 8,
  ): Promise<CreatePostDto[]> {
    return this.postsService.get(page, limit);
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new post',
    description: 'Create a new post',
  })
  @ApiCreatedResponse({
    status: 201,
    description: 'Post successfully created.',
    type: CreatePostDto,
  })
  async addPost(@Body() dto: CreatePostDto) {
    console.log(dto);
    // const post = this.postsService.add(dto);

    // if (!post) {
    //   throw new BadRequestException({
    //     message: 'Something went wrong when creating a post',
    //   });
    // }

    return { message: 'Post has been successfully created' };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a post',
    description: 'Update a post by ID.',
  })
  @ApiParam({ name: 'id', description: 'Post ID' })
  async updateAnArticle(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    const updatedPost = await this.postsService.updateById(id, dto);

    return { message: 'Post has been successfully updated', updatedPost };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a post',
    description: 'Delete a post by ID.',
  })
  @ApiParam({ name: 'id', description: 'Post ID' })
  async removeArticle(@Param('id') id: string) {
    const deletedAticle = this.postsService.remove(id);

    if (!deletedAticle) {
      throw new BadRequestException({
        message: `Post doesn't exist or already deleted by someone else`,
      });
    }

    return { message: 'Post has been successfully deleted' };
  }
}
