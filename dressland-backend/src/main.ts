import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // allow all origins
  app.enableCors();
  // start listening to requests

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  // log host and port
}
bootstrap();
