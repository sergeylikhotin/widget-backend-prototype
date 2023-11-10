import { Injectable } from '@nestjs/common';
import { Widget } from '@prisma/client';
import { SchemaService } from '../schema/schema.service';
import { PrismaService } from '../prisma/prisma.service';
import { CursorPaginationDto, PaginationDto } from 'src/common/dto';
import { CreateWidgetDto, UpdateWidgetDto } from './widget.dto';

@Injectable()
export class WidgetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly schemaService: SchemaService
  ) {}

  async create(dto: CreateWidgetDto) {
    return this.prisma.widget.create({
      data: dto
    });
  }

  async update(widgetId: string, dto: UpdateWidgetDto) {
    return this.prisma.widget.update({
      data: dto,
      where: { id: widgetId }
    });
  }

  async remove(widgetId: string) {
    return this.prisma.widget.delete({
      where: {
        id: widgetId
      }
    });
  }

  async getMany({ take, cursor }: CursorPaginationDto) {
    const cursorArgs: any = cursor ? { skip: 1, cursor: { id: cursor } } : {};
    const widgets = await this.prisma.widget.findMany({
      take,
      ...cursorArgs
    });

    return {
      data: widgets,
      count: widgets.length,
      cursor: widgets.at(-1).id
    };
  }

  async getOne(widgetId: string) {
    return this.prisma.widget.findUnique({ where: { id: widgetId } });
  }

  async render(widgetId: string) {
    const widget = await this.prisma.widget.findUnique({
      where: { id: widgetId },
      include: {
        schema: {
          select: { id: true }
        }
      }
    });

    return this.schemaService.build(widget.schema.id);
  }
}
