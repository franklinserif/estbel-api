import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@configEnv/enum/env';
import { PostgresErrorFilter } from '@common/errorsFilters/postgressErrorFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new PostgresErrorFilter());

  const configService = app.get(ConfigService);
  const port = configService.get<number | undefined>(EnvironmentVariables.PORT);
  await app.listen(port ?? 3000);
}
bootstrap();
