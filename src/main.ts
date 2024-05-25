import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '../all-exceptions-filter';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config({ path: './config.env' });
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away unknown properties from the DTO
      forbidNonWhitelisted: true, // Throws an error if unknown properties are present
      transform: true, // Automatically transforms incoming payloads to DTO instances
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT);
}
bootstrap();
