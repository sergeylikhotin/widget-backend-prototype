import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Component } from '@prisma/client';

type ComponentWithChildren = Component & {
  children?: Component[];
};

@Injectable()
export class SchemaRenderService {
  constructor(private readonly prisma: PrismaService) {}

  async getSchema(schemaName: string): Promise<any> {
    const schema = await this.prisma.schema.findFirst({
      where: { name: schemaName }
    });

    if (!schema) return null;

    // 1. Получаем все компоненты, связанные со схемой
    const components = await this.prisma.component.findMany({
      where: { schemaId: schema.id }
    });

    if (components.length === 0) return null;

    // 2. Получаем корневой компонент
    const rootComponent = components.find((comp) => comp.parentId == null);

    // 3. Восстанавливаем иерархию
    const hierarchy = this.buildComponentHierarchy(
      components,
      rootComponent.id
    );

    return hierarchy;
  }

  // Собирает рекурсивно компоненты
  private buildComponentHierarchy(
    components: Component[],
    parentComponentId: number
  ): any {
    const root: ComponentWithChildren = components.find(
      (comp) => comp.id === parentComponentId
    );
    if (!root) return null;

    const children = components.filter((comp) => comp.parentId === root.id);
    root.children = children.map((child) =>
      this.buildComponentHierarchy(components, child.id)
    );

    return root;
  }
}
