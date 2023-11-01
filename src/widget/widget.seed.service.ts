import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { widgetSeedData } from './widget.seed.data';

@Injectable()
export class WidgetSeedService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}
  async onModuleInit() {
    let widget = await this.prisma.widget.findFirst();
    if (widget == null) {
      widget = await this.prisma.widget.create({
        data: widgetSeedData
      });
    }
  }
}
