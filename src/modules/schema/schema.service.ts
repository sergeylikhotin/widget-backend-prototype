import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  ComponentModel,
  SchemaComponentFactory
} from './schema.component.factory';
import { CreateSchemaDto } from './schema.dto';
import { PrismaService } from '../prisma/prisma.service';

const componentFullArgs = Prisma.validator<Prisma.ComponentDefaultArgs>()({
  include: {
    eventsContainer: true
  }
});
export type Component = Prisma.ComponentGetPayload<typeof componentFullArgs>;

@Injectable()
export class SchemaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly schemaComponentFactory: SchemaComponentFactory
  ) {}

  async create(dto: CreateSchemaDto) {
    return this.prisma.schema.create({
      data: dto
    });
  }

  async build(schemaId: string) {
    const schema = await this.prisma.schema.findUnique({
      where: { id: schemaId },
      include: { components: componentFullArgs }
    });
    const components: Component[] = schema.components;
    const rootComponent: Component = components.find(
      (comp) => comp.parentId == null
    );
    const childIndexMap = this.createChildIndexMap(components);

    return this.buildComponentTree(rootComponent, childIndexMap);
  }

  private createChildIndexMap(
    components: Component[]
  ): Map<string, Component[]> {
    const map = new Map<string, Component[]>();

    components.forEach((comp) => {
      const key = comp.parentId ?? 'root';
      const children = map.get(key) || [];
      children.push(comp);

      map.set(key, children);
    });

    return map;
  }

  private buildComponentTree(
    component: Component,
    childIndexMap: Map<string, Component[]>
  ): ComponentModel {
    const model = this.schemaComponentFactory.create(component);

    const children = childIndexMap.get(component.id) || [];
    if (children.length === 0) {
      return model;
    }

    return {
      ...model,
      children: children.map((comp) =>
        this.buildComponentTree(comp, childIndexMap)
      )
    };
  }
}
