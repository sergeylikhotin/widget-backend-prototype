import { Injectable } from '@nestjs/common';
import { Widget } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WidgetService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<Widget[]> {
    return this.prisma.widget.findMany();
  }
}
