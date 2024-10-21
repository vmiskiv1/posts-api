import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigService } from './config.service';
import configuration from './configuration';
/**
 * Import and provide app configuration related classes.
 *
 * @module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        NATURE_NEWS_URL: Joi.string().default(
          'https://newsapi.org/v2/everything?q=bitcoin',
        ),
        API_KEY: Joi.string().default(''),
        MONGODB_URI: Joi.string().default(''),
        JWT_SECRET: Joi.string().default(''),
        PORT: Joi.number().default(8080),
      }),
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
