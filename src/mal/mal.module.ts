import { Module } from '@nestjs/common';
import { MalService } from './mal.service';

@Module({
  providers: [MalService],
  exports: [MalService],
})
export class MalModule {}
