import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  Res,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/access.guard';
import {
  CaslPolicyHandler,
  CheckPolicies,
  PoliciesGuard
} from 'src/common/guards/policies.guard';
import { Response } from 'express';
import { WidgetService } from './widget.service';
import { CursorPaginationDto, PaginationDto } from 'src/common/dto';

@ApiTags('widget')
@Controller('widgets')
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) {}

  @ApiBearerAuth()
  @CheckPolicies(new CaslPolicyHandler('read', 'Widget'))
  @UseGuards(AccessTokenGuard, PoliciesGuard)
  @Get()
  async getMany(@Res() res: Response, @Query() query: CursorPaginationDto) {
    const widgets = await this.widgetService.getMany(query);

    res.status(HttpStatus.OK).json(widgets);
  }

  @Get(':widgetId')
  async getOne(@Param('widgetId') widgetId: string) {
    return this.widgetService.getOne(widgetId);
  }

  @Get(':widgetId/render')
  async render(@Param('widgetId') widgetId: string) {
    return this.widgetService.render(widgetId);
  }
}
