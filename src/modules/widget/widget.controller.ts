import {
  Controller,
  Get,
  HttpStatus,
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
import { PaginationDto } from 'src/common/dto';

@ApiTags('widget')
@Controller('widget')
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) {}

  @ApiBearerAuth()
  @CheckPolicies(new CaslPolicyHandler('read', 'Widget'))
  @UseGuards(AccessTokenGuard, PoliciesGuard)
  @Get()
  async get(@Res() res: Response, @Query() query: PaginationDto) {
    const widgets = await this.widgetService.getWidgets(query);

    res.status(HttpStatus.OK).json(widgets);
  }
}