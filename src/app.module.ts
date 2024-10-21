import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { Post, PostSchema } from './posts/entities/post.schema';
import { PostsController } from './posts/posts.controller';
import { PostsModule } from './posts/posts.module';
import { PostsRepository } from './posts/posts.repository';
import { PostsService } from './posts/posts.service';

import configuration from './config/configuration';

import { AppConfigModule } from './config/config.module';
import { AppConfigService } from './config/config.service';

@Module({
  imports: [
    AppConfigModule,
    PostsModule,
    ScheduleModule.forRoot(),
    HttpModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (appConfigService: AppConfigService) => ({
        uri: appConfigService.mongodb,
      }),
      inject: [AppConfigService],
    }),
    HttpModule,
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostsController],
  providers: [AppConfigService, PostsRepository, PostsService],
})
export class AppModule {}
