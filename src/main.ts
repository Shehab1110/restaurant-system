import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './errors/all-exceptions-filter';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const envFilePath: string =
    process.env.NODE_ENV === 'production'
      ? './src/envs/production.env'
      : './src/envs/development.env';
  dotenv.config({ path: envFilePath });

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away unknown properties from the DTO
      forbidNonWhitelisted: true, // Throws an error if unknown properties are present
      transform: true, // Automatically transforms incoming payloads to DTO instances
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT, () =>
    console.log(`App is running on port: ${process.env.PORT}`),
  );
}
bootstrap();
