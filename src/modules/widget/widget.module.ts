import { Module } from '@nestjs/common';
import { WidgetService } from './widget.service';
import { WidgetController } from './widget.controller';
import { SchemaModule } from '../schema/schema.module';

@Module({
  providers: [WidgetService],
  controllers: [WidgetController],
  imports: [SchemaModule]
})
export class WidgetModule {}
