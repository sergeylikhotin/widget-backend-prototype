import { Controller, Get } from '@nestjs/common';
import { WidgetService } from './widget.service';

@Controller('widgets')
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) {}

  @Get()
  async getAll() {
    return this.widgetService.getAll();
  }
}
