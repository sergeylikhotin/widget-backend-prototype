import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WidgetService {
  constructor(private readonly prisma: PrismaService) {}

  async getWidgets({ skip, take }: PaginationDto) {
    const widgets = await this.prisma.widget.findMany({
      skip,
      take
    });

    return widgets;
  }
}
