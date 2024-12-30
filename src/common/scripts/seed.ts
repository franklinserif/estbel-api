import { NestFactory } from '@nestjs/core';
import { SeedsModule } from '@seeds/seeds.module';
import { SeedsService } from '@seeds/seeds.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedsModule);

  const seedsService = app.get(SeedsService);

  const [, , command] = process.argv;

  if (command === 'run') {
    await seedsService.run();
  } else if (command === 'drop') {
    await seedsService.drop();
  } else {
    console.error('Invalid command. Use "run" or "drop".');
    process.exit(1);
  }

  await app.close();
}

bootstrap();
