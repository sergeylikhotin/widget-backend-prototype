import { ComponentType } from '@prisma/client';
import { ComponentFull } from './schema.service';
import { Injectable } from '@nestjs/common';

export interface ComponentModel {
  id: string;
  name: string;

  props?: Record<string, any>;

  source?: string;
  bindings?: Record<string, any>;

  children?: ComponentModel[];
}
export type ComponentBuilder = (comp: ComponentFull) => ComponentModel;
@Injectable()
export class SchemaComponentFactory {
  private readonly componentBuilders: Record<ComponentType, ComponentBuilder> =
    {
      [ComponentType.Base]: (comp: ComponentFull) => this.getModel(comp),
      [ComponentType.Root]: (comp: ComponentFull) => this.getModel(comp),

      [ComponentType.DataSource]: (comp: ComponentFull) => ({
        ...this.getModel(comp),

        source: comp.dataSource.source
      }),

      [ComponentType.Text]: (comp: ComponentFull) =>
        this.getModel(comp, { value: comp?.text?.value }),
      [ComponentType.Image]: (comp: ComponentFull) =>
        this.getModel(comp, { url: comp?.image?.url })
    };

  private getModel = (
    component: ComponentFull,
    props?: Record<string, any>
  ): ComponentModel => {
    let model: ComponentModel = {
      id: component.id,
      name: component.componentSchema.name,

      props
    };
    if (component.dataBinded) {
      model = {
        ...model,
        bindings: component.dataBinded.bindings as Record<string, any>
      };
    }

    return model;
  };

  create(component: ComponentFull): ComponentModel {
    const componentSchemaType = component.componentSchema.type;
    const builder = this.componentBuilders[componentSchemaType];
    if (builder == null) {
      throw new Error(
        `No ${componentSchemaType} builder implementation found.`
      );
    }

    return builder(component);
  }
}
