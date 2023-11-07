import { Component } from './schema.service';
import { Injectable } from '@nestjs/common';

export interface ComponentModel {
  id: string;
  name: string;

  props?: Record<string, any>;

  source?: string;
  bindings?: Record<string, string>;

  children?: ComponentModel[];
}
export type ComponentBuilder = (comp: Component) => ComponentModel;
@Injectable()
export class SchemaComponentFactory {
  private readonly componentBuilders: Record<string, ComponentBuilder> = {
    Unknown: (comp: Component) => this.getModel(comp),
    Container: (comp: Component) => this.getModel(comp),
    Root: (comp: Component) => this.getModel(comp),

    Text: (comp: Component) => this.getModel(comp),
    Image: (comp: Component) => this.getModel(comp)
  };

  private getModel = (component: Component): ComponentModel => {
    return {
      id: component.id,
      name: component.type,

      props: component.props as Record<string, any>,
      bindings: component.bindings as Record<string, string>
    };
  };

  create(component: Component): ComponentModel {
    const componentSchemaType = component.type;
    const builder = this.componentBuilders[componentSchemaType];
    if (builder == null) {
      throw new Error(
        `No ${componentSchemaType} builder implementation found.`
      );
    }

    return builder(component);
  }
}
