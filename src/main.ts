import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV_VAR } from '@configuration/enum/env';
import { GlobalErrorFilter } from '@common/errorsFilters/globalErrorFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new GlobalErrorFilter());

  const configService = app.get(ConfigService);
  const port = configService.get<number | undefined>(ENV_VAR.PORT);
  await app.listen(port ?? 3000);
}
bootstrap();
