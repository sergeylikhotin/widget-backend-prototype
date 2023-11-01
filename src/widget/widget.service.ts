import { Injectable } from '@nestjs/common';
import { Widget } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SchemaService } from '../schema/schema.service';

@Injectable()
export class WidgetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly schemaService: SchemaService
  ) {}

  async getAll(): Promise<Widget[]> {
    return this.prisma.widget.findMany();
  }

  async getOne(widgetId: string) {
    return this.prisma.widget.findUnique({ where: { id: widgetId } });
  }

  async render(widgetId: string) {
    const widget = await this.prisma.widget.findUnique({
      where: { id: widgetId },
      include: { schema: true }
    });

    return this.schemaService.build(widget.schema.id);
  }
}
