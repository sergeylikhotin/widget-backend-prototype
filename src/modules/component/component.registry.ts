import Ajv, { AnySchemaObject, ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import * as path from 'path';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { promises as fs } from 'fs';

class ComponentSchema {
  readonly name: string;
  readonly description: string;

  readonly props: AnySchemaObject;
  readonly bindings: AnySchemaObject;

  validateProps: ValidateFunction;
  validateBindings: ValidateFunction;

  constructor(schema: any, ajv: Ajv) {
    Object.assign(this, schema);

    this.validateProps = ajv.compile(schema.props);
    this.validateBindings = ajv.compile(schema.bindings);
  }
}

@Injectable()
export class ComponentSchemaRegistry implements OnModuleInit {
  private readonly registry: Map<string, ComponentSchema>;
  private readonly ajv: Ajv;
  constructor() {
    this.registry = new Map<string, ComponentSchema>();

    this.ajv = new Ajv({ allErrors: true });
    addFormats(this.ajv);
  }

  get(type: string) {
    return this.registry.get(type);
  }

  toJSON() {
    const obj = {};
    for (const [key, value] of this.registry) {
      obj[key] = value;
    }

    return obj;
  }

  async onModuleInit() {
    const files = await fs.readdir(ComponentSchemaRegistry.COMPONENTS_DIR_PATH);
    const filteredFiles = files.filter(
      (name) => name.endsWith('.json') && !name.includes('disabled')
    );

    for (const file of filteredFiles) {
      const [type] = file.split('.');
      const schema = JSON.parse(
        await fs.readFile(
          path.join(ComponentSchemaRegistry.COMPONENTS_DIR_PATH, file),
          'utf8'
        )
      );

      this.registry.set(type, new ComponentSchema(schema, this.ajv));
    }
  }

  static COMPONENTS_DIR_PATH = path.join(process.cwd(), './src/components');
}
