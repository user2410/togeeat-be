import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // enable class-transformer
    transformOptions: {
      enableImplicitConversion: true, // enable plain-to-class conversion
    },
  }));

  // add a listener for Prisma beforeExit event
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const config = new DocumentBuilder()
    .setTitle('Togeeat backend API')
    .setDescription('Togeeat API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configs = app.get(ConfigService);
  console.log(configs);

  const port: number = (configs.get('PORT') as number) || 8080;
  await app.listen(port, () => console.log(`Listening on port ${port}`));
}
bootstrap();
