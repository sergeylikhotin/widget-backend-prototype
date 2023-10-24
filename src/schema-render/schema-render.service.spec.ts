import { Test, TestingModule } from '@nestjs/testing';
import { SchemaRenderService } from './schema-render.service';

describe('SchemaRenderService', () => {
  let service: SchemaRenderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchemaRenderService],
    }).compile();

    service = module.get<SchemaRenderService>(SchemaRenderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
