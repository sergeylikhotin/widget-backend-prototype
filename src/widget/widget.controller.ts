import { Controller, Get, Param } from '@nestjs/common';
import { WidgetService } from './widget.service';

@Controller('widgets')
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) {}

  @Get()
  async getAll() {
    return this.widgetService.getAll();
  }

  @Get(':widgetId')
  async getOne(@Param('widgetId') widgetId: string) {
    return this.widgetService.getOne(widgetId);
  }

  @Get(':widgetId/render')
  async render(@Param('widgetId') widgetId: string) {
    return this.widgetService.render(widgetId);
  }
}