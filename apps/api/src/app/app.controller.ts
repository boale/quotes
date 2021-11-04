import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  @Get([ 'ping', 'health' ])
  ping() {
    return { statusCode: 200, message: 'OK' };
  }
}
