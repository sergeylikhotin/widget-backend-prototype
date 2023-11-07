import { Module } from '@nestjs/common';
import { DataGateway } from './data.gateway';

@Module({
  providers: [DataGateway]
})
export class DataModule {}
