import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/')
export class AppController {
  constructor(private indexWelcome: AppService) {}

  @Get()
  index() {
    return this.indexWelcome.index();
  }
}
