import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV_VAR } from '@configuration/enum/env';
import { GlobalErrorFilter } from '@common/errorsFilters/globalErrorFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new GlobalErrorFilter());

  app.use(cookieParser());

  const configService = app.get(ConfigService);
  const port = configService.get<number | undefined>(ENV_VAR.PORT);
  await app.listen(port ?? 3000);
}
bootstrap();
