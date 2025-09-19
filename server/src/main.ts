import { Logger, ValidationPipe } from '@nestjs/common';
import { bootstrapApplication } from './app';

async function bootstrap() {
  const PORT = 3110;
  const app = await bootstrapApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(PORT);
  Logger.debug(`Server running on ${await app.getUrl()}/api`);
}
bootstrap();
