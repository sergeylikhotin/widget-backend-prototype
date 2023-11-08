import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CaslAbilityFactory } from './casl-ability.factory';
import { CaslController } from './casl.controller';
import { CaslSeed } from './casl.seed.service';
import { CaslService } from './casl.service';

@Global()
@Module({
  imports: [],
  controllers: [CaslController],
  providers: [CaslService, CaslAbilityFactory, CaslSeed],
  exports: [CaslService, CaslAbilityFactory, CaslSeed]
})
export class CaslModule {}
