import { Global, Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { CaslSeed } from './casl.seed.service';
import { CaslService } from './casl.service';
import { CaslController } from './casl.controller';

@Global()
@Module({
  controllers: [CaslController],
  providers: [CaslService, CaslAbilityFactory, CaslSeed],
  exports: [CaslService, CaslAbilityFactory, CaslSeed]
})
export class CaslModule {}
