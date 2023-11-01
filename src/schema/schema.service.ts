import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ComponentModel,
  SchemaComponentFactory
} from './schema.component.factory';

const componentFullArgs = Prisma.validator<Prisma.ComponentDefaultArgs>()({
  include: {
    componentSchema: true,

    dataBinded: true,
    dataSource: true,

    text: true,
    image: true,

    eventsContainer: true
  }
});
const componentWithSchema = Prisma.validator<Prisma.ComponentDefaultArgs>()({
  include: { componentSchema: true }
});
export type ComponentFull = Prisma.ComponentGetPayload<
  typeof componentFullArgs
>;
export type ComponentWithSchema = Prisma.ComponentGetPayload<
  typeof componentWithSchema
>;

@Injectable()
export class SchemaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly schemaComponentFactory: SchemaComponentFactory
  ) {}

  async build(schemaId: string) {
    const schema = await this.prisma.schema.findUnique({
      where: { id: schemaId },
      include: { components: componentFullArgs }
    });
    const components: ComponentFull[] = schema.components;
    const rootComponent: ComponentFull = components.find(
      (comp) => comp.parentId == null
    );
    const childIndexMap = this.createChildIndexMap(components);

    return this.buildComponentTree(rootComponent, childIndexMap);
  }

  private createChildIndexMap(
    components: ComponentFull[]
  ): Map<string, ComponentFull[]> {
    const map = new Map<string, ComponentFull[]>();

    components.forEach((comp) => {
      const key = comp.parentId ?? 'root';
      const children = map.get(key) || [];
      children.push(comp);

      map.set(key, children);
    });

    return map;
  }

  private buildComponentTree(
    component: ComponentFull,
    childIndexMap: Map<string, ComponentFull[]>
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
