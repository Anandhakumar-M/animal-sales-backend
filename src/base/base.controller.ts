import { Controller, Get } from '@nestjs/common';

@Controller()
export class BaseController {
  constructor() {}

  @Get()
  root(): string {
    return 'App is Live';
  }

  @Get('health_check')
  health_check(): string {
    return 'App Health is Good';
  }
}
