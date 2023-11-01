import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { schemaSeedData } from './schema.seed.data';
import { ComponentType } from '@prisma/client';
import { widgetSeedData } from '../widget/widget.seed.data';

@Injectable()
export class SchemaSeedService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const widget = await this.prisma.widget.findUnique({
      where: widgetSeedData
    });
    let schema = await this.prisma.schema.findUnique({
      where: schemaSeedData
    });
    if (schema == null) {
      schema = await this.prisma.schema.create({
        data: { ...schemaSeedData, widgetId: widget.id }
      });
    }

    let rootContainerComponentSchema =
      await this.prisma.componentSchema.findFirst({
        where: { name: 'RootContainer' }
      });
    if (rootContainerComponentSchema == null) {
      rootContainerComponentSchema = await this.prisma.componentSchema.create({
        data: {
          name: 'RootContainer',
          type: ComponentType.Root
        }
      });
    }

    let containerComponentSchema = await this.prisma.componentSchema.findFirst({
      where: { name: 'Container' }
    });
    if (containerComponentSchema == null) {
      containerComponentSchema = await this.prisma.componentSchema.create({
        data: {
          name: 'Container',
          type: ComponentType.Base
        }
      });
    }

    let textComponentSchema = await this.prisma.componentSchema.findFirst({
      where: { name: 'Text' }
    });
    if (textComponentSchema == null) {
      textComponentSchema = await this.prisma.componentSchema.create({
        data: {
          name: 'Text',
          type: ComponentType.Text
        }
      });
    }

    let imageComponentSchema = await this.prisma.componentSchema.findFirst({
      where: { name: 'Image' }
    });
    if (imageComponentSchema == null) {
      imageComponentSchema = await this.prisma.componentSchema.create({
        data: {
          name: 'Image',
          type: ComponentType.Image
        }
      });
    }

    let rootContainerComponent = await this.prisma.component.findFirst({
      where: {
        componentSchemaId: rootContainerComponentSchema.id,
        schemaId: schema.id
      }
    });
    if (rootContainerComponent == null) {
      rootContainerComponent = await this.prisma.component.create({
        data: {
          componentSchemaId: rootContainerComponentSchema.id,
          schemaId: schema.id
        }
      });
    }

    let container1Component = await this.prisma.component.findFirst({
      where: { id: 'container1', schemaId: schema.id }
    });
    if (container1Component == null) {
      container1Component = await this.prisma.component.create({
        data: {
          id: 'container1',
          parentId: rootContainerComponent.id,

          componentSchemaId: containerComponentSchema.id,
          schemaId: schema.id
        }
      });
    }

    let text1Component = await this.prisma.component.findFirst({
      where: { id: 'text1', schemaId: schema.id }
    });
    if (text1Component == null) {
      text1Component = await this.prisma.component.create({
        data: {
          id: 'text1',
          parentId: rootContainerComponent.id,

          componentSchemaId: textComponentSchema.id,
          schemaId: schema.id,

          text: {
            create: {
              value: 'Test text in root container'
            }
          }
        }
      });
    }

    let text2Component = await this.prisma.component.findFirst({
      where: { id: 'text2', schemaId: schema.id }
    });
    if (text2Component == null) {
      text2Component = await this.prisma.component.create({
        data: {
          id: 'text2',
          parentId: container1Component.id,

          componentSchemaId: textComponentSchema.id,
          schemaId: schema.id,

          text: {
            create: {
              value: 'Test text in container1'
            }
          }
        }
      });
    }

    let container2Component = await this.prisma.component.findFirst({
      where: { id: 'container2', schemaId: schema.id }
    });
    if (container2Component == null) {
      container2Component = await this.prisma.component.create({
        data: {
          id: 'container2',
          parentId: container1Component.id,

          componentSchemaId: containerComponentSchema.id,
          schemaId: schema.id
        }
      });
    }

    let container3Component = await this.prisma.component.findFirst({
      where: { id: 'container3', schemaId: schema.id }
    });
    if (container3Component == null) {
      container3Component = await this.prisma.component.create({
        data: {
          id: 'container3',
          parentId: container2Component.id,

          componentSchemaId: containerComponentSchema.id,
          schemaId: schema.id
        }
      });
    }

    let image1Component = await this.prisma.component.findFirst({
      where: { id: 'image1', schemaId: schema.id }
    });
    if (image1Component == null) {
      image1Component = await this.prisma.component.create({
        data: {
          id: 'image1',
          parentId: container3Component.id,

          componentSchemaId: imageComponentSchema.id,
          schemaId: schema.id,

          image: {
            create: {
              url: 'Test image url in container3'
            }
          }
        }
      });
    }
  }
}
