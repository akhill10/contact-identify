import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    origin: [
      /http\:\/\/localhost\:\d{1,5}$/,
      // for your production domain
      /https\:\/\/.+\.yourapp\.com$/,
      // for your production domain 2
      /https\:\/\/.+\.your\.app\.com$/,
    ],
  });
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  console.info('LISTENING ON PORT :: ', port);
}
bootstrap();
