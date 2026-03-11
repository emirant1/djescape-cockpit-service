import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

/**
 * This is the entry point of the NestJS application
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* Triggers the validation of the decorators placed on the DTOs */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true /* This will automatically transform the payload to the DTO object type */,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
