import { Module } from '@nestjs/common';
import { WidgetService } from './widget.service';
import { WidgetController } from './widget.controller';
import { WidgetSeedService } from './widget.seed.service';
import { SchemaModule } from '../schema/schema.module';

@Module({
  providers: [WidgetService, WidgetSeedService],
  controllers: [WidgetController],
  imports: [SchemaModule]
})
export class WidgetModule {}
