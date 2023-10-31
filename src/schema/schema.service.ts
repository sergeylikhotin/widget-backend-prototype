import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  ComponentType,
  DataBindedComponent,
  DataSourceComponent,
  ImageComponent,
  Prisma,
  TextComponent
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

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

export interface ComponentModel {
  id: string;
  name: string;

  parentId: string;

  toJSON(): any;
}

export class BaseComponentModel implements ComponentModel {
  public readonly id: string;
  public readonly name: string;

  public readonly parentId: string;

  constructor(component: ComponentWithSchema) {
    this.id = component.id;
    this.name = component.componentSchema.name;

    this.parentId = component.parentId;
  }

  public toJSON(): any {
    return {
      id: this.id,
      name: this.name
    };
  }
}

export class TextComponentModel extends BaseComponentModel {
  public readonly value: string;

  constructor(component: ComponentWithSchema, textComponent: TextComponent) {
    super(component);

    this.value = textComponent.value;
  }

  public toJSON() {
    return {
      ...super.toJSON(),

      props: {
        value: this.value
      }
    };
  }
}

export class ImageComponentModel extends BaseComponentModel {
  public readonly url: string;

  constructor(component: ComponentWithSchema, textComponent: ImageComponent) {
    super(component);

    this.url = textComponent.url;
  }

  public toJSON() {
    return {
      ...super.toJSON(),

      props: {
        url: this.url
      }
    };
  }
}

export class DataSourceComponentModel extends BaseComponentModel {
  public readonly source: string;

  constructor(
    component: ComponentWithSchema,
    dataSourceComponent: DataSourceComponent
  ) {
    super(component);

    this.source = dataSourceComponent.source;
  }

  public toJSON() {
    return {
      ...super.toJSON(),

      source: this.source
    };
  }
}

export class DataBindedComponentModel implements ComponentModel {
  constructor(
    private readonly componentModel: BaseComponentModel,
    private readonly dataBindedComponent: DataBindedComponent
  ) {}

  public get id() {
    return this.componentModel.id;
  }

  public get name() {
    return this.componentModel.name;
  }

  public get parentId() {
    return this.componentModel.parentId;
  }

  public get dataBindings(): Prisma.JsonValue {
    return this.dataBindedComponent.bindings;
  }

  public toJSON() {
    return {
      ...this.componentModel.toJSON(),

      dataBindings: this.dataBindings
    };
  }
}

export class ComponentModelFactory {
  private static readonly components: Record<
    ComponentType,
    new (...args: any) => ComponentModel
  > = {
    [ComponentType.Base]: BaseComponentModel,
    [ComponentType.Root]: BaseComponentModel,

    [ComponentType.Text]: TextComponentModel,
    [ComponentType.Image]: ImageComponentModel
  };

  static create(component: ComponentFull): ComponentModel {
    const componentSchemaType = component.componentSchema.type;
    const ctor = this.components[componentSchemaType];
    if (ctor == null) {
      throw new Error(
        `No ${componentSchemaType}ComponentModel implementaion found.`
      );
    }

    const componentType = component[componentSchemaType.toLowerCase()];
    if (ctor.length > 1 && componentType == null) {
      throw new InternalServerErrorException(
        `No ${componentSchemaType.toLowerCase()} model found in Component#${
          component.id
        }.`
      );
    }

    return new ctor(component, componentType);
  }
}

@Injectable()
export class SchemaService {
  constructor(private readonly prisma: PrismaService) {}

  async build(schemaId: string) {
    const schema = await this.prisma.schema.findUnique({
      where: { id: schemaId },
      include: { components: componentFullArgs }
    });
    const componentsModels: ComponentModel[] = schema.components.map((comp) =>
      ComponentModelFactory.create(comp)
    );
    const rootComponent: ComponentModel = componentsModels.find(
      (comp) => comp.parentId == null
    );

    return this.buildComponentHierarchical(componentsModels, rootComponent);
  }

  buildComponentHierarchical(
    components: ComponentModel[],
    parentComponent: ComponentModel
  ): ComponentModel & { children?: ComponentModel[] } {
    const children = components.filter(
      (comp) => comp.parentId === parentComponent.id
    );
    if (children.length === 0) {
      return parentComponent.toJSON();
    }

    return {
      ...parentComponent.toJSON(),
      children: children.map((comp) =>
        this.buildComponentHierarchical(components, comp)
      )
    };
  }
}
