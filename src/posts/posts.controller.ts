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
import { PostSummaryDto } from './dto/post-summary.dto';
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
  async getPosts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 8,
  ): Promise<PostSummaryDto[]> {
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
  async add(@Body() dto: CreatePostDto) {
    const post = this.postsService.add(dto);

    if (!post) {
      throw new BadRequestException({
        message: 'Something went wrong when creating a post',
      });
    }

    return { message: 'Post has been successfully created' };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get post by ID',
    description: 'Retrieve a single post by its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved post',
    type: CreatePostDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  async getPostById(@Param('id') id: string): Promise<any> {
    return this.postsService.getById(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a post',
    description: 'Update a post by ID.',
  })
  @ApiParam({ name: 'id', description: 'Post ID' })
  async update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    const updatedPost = await this.postsService.updateById(id, dto);

    return { message: 'Post has been successfully updated', updatedPost };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a post',
    description: 'Delete a post by ID.',
  })
  @ApiParam({ name: 'id', description: 'Post ID' })
  async remove(@Param('id') id: string) {
    const post = await this.postsService.remove(id);

    if (!post) {
      throw new BadRequestException({
        message: `Post doesn't exist or already deleted by someone else`,
      });
    }

    return { message: 'Post has been successfully deleted' };
  }
}
