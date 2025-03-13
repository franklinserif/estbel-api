import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('test')
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Endpoint to get a hello message.
   * @returns {string} - The hello message.
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/debug-sentry')
  getError() {
    throw new Error('My first Sentry error!!!');
  }
}
