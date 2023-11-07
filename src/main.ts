import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.enableCors({
    origin: '*'
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
      stopAtFirstError: true
    })
  );
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('WIDGETS API')
    .addBearerAuth()
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(5001);
}

bootstrap();
