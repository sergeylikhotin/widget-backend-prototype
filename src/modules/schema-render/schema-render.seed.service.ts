import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SchemaRenderSeedService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    let schema = await this.prisma.schema.findFirst({
      where: { name: 'test' }
    });

    if (schema == null) {
      schema = await this.prisma.schema.create({
        data: {
          name: 'test'
        }
      });
    }

    const components = await this.prisma.component.findMany({
      where: { schemaId: schema.id }
    });

    if (components.length != 7) {
      await this.prisma.component.deleteMany();

      const root = await this.prisma.component.create({
        data: { schemaId: schema.id, name: 'Root' }
      });

      const box1 = await this.prisma.component.create({
        data: { schemaId: schema.id, name: 'Box', parentId: root.id }
      });

      const text1 = await this.prisma.component.create({
        data: { schemaId: schema.id, name: 'Text', parentId: root.id }
      });

      const text2 = await this.prisma.component.create({
        data: { schemaId: schema.id, name: 'Text', parentId: box1.id }
      });

      const image1 = await this.prisma.component.create({
        data: { schemaId: schema.id, name: 'Image', parentId: box1.id }
      });

      const box2 = await this.prisma.component.create({
        data: { schemaId: schema.id, name: 'Box', parentId: box1.id }
      });

      const text3 = await this.prisma.component.create({
        data: { schemaId: schema.id, name: 'Text', parentId: box2.id }
      });

      components.push(root, box1, text1, text2, image1, box2, text3);
    }
  }
}
