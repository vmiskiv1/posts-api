import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.PORT,
  mongodb: process.env.MONGODB_URI,
}));
