import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Returns a hello message.
   * @returns {string} - The hello message.
   */
  getHello(): string {
    return 'Hello World!';
  }
}
