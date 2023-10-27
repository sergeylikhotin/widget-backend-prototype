import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Component, Prisma, ContainerComponent } from '@prisma/client';

const component = Prisma.validator<Prisma.ComponentDefaultArgs>()({
  include: {
    componentSchema: true,
    schema: true,
    container: true,
    image: true,
    parent: true,
    text: true
  }
});
type ComponentFull = Prisma.ComponentGetPayload<typeof component>;

class ComponentModel {
  public readonly id: number;
  public readonly name: string;
  public readonly props: { [key: string]: any };

  protected readonly component: ComponentFull;

  constructor(component: ComponentFull) {
    this.component = component;

    this.id = component.id;
    this.name = component.componentSchema.name;

    this.props = this.getProps();
  }

  protected getProps(): { [key: string]: any } {
    return {};
  }
}

class ContainerComponentModel extends ComponentModel {
  public readonly children: ComponentModel[];

  constructor(component: ComponentFull, components: ComponentFull[]) {
    super(component);

    this.children = components
      .filter((comp) => comp.parentId === this.id)
      .map((comp) => new ComponentModel(comp));
  }
}

class TextComponentModel extends ComponentModel {
  public readonly text: string;

  constructor(component: ComponentFull) {
    super(component);

    this.text = component.text.value;
  }

  protected getProps(): { [p: string]: any } {
    return { text: this.component.text.value };
  }
}

class ImageComponentModel extends ComponentModel {
  public readonly url: string;

  constructor(component: ComponentFull) {
    super(component);

    this.url = component.image.url;
  }

  protected getProps(): { [p: string]: any } {
    return { url: this.component.image.url };
  }
}

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

@Injectable()
export class SchemaRenderOldService {
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
