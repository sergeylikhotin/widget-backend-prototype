import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComponentDto, UpdateComponentDto } from './component.dto';

@Injectable()
export class ComponentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateComponentDto) {
    return this.prisma.component.create({
      data: dto
    });
  }

  async update(componentId: string, dto: UpdateComponentDto) {
    return this.prisma.component.update({
      data: dto,
      where: { id: componentId }
    });
  }

  async remove(componentId: string) {
    return this.prisma.component.delete({
      where: { id: componentId }
    });
  }

  async getMany(take: number = 10, cursor?: string) {
    const cursorArgs: any = cursor ? { skip: 1, cursor: { id: cursor } } : {};

    const components = await this.prisma.component.findMany({
      take: take,

      ...cursorArgs
    });

    return {
      data: components,
      count: components.length,
      cursor: components.at(-1).id
    };
  }

  async getOne(componentId: string) {
    return this.prisma.component.findUnique({
      where: { id: componentId }
    });
  }
}
