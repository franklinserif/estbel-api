import { NestFactory } from '@nestjs/core';
import { SeedsModule } from '../seeds/seeds.module';
import { SeedsService } from '../seeds/seeds.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedsModule);

  const seedsService = app.get(SeedsService);

  await seedsService.run();

  await app.close();
}

bootstrap();
