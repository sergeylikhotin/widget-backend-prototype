import { Module } from '@nestjs/common';
import { ComponentService } from './component.service';
import { ComponentController } from './component.controller';
import { ComponentSchemaRegistry } from './component.registry';
import { IsEntityExistConstraint } from '../../common/validators/isEntityExist';
import { IsComponentTypeConstraint } from '../../common/validators/isComponentType';
import { IsComponentDetailsConstraint } from '../../common/validators/isComponentDetailsValid';

@Module({
  providers: [
    ComponentService,
    ComponentSchemaRegistry,

    IsEntityExistConstraint,
    IsComponentTypeConstraint,
    IsComponentDetailsConstraint
  ],
  controllers: [ComponentController]
})
export class ComponentModule {}
