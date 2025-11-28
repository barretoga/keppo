import { Module } from '@nestjs/common';
import { MangaUpdatesService } from './manga-updates.service';

@Module({
  providers: [MangaUpdatesService],
  exports: [MangaUpdatesService],
})
export class MangaUpdatesModule {}
