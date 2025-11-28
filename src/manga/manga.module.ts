import { Module, forwardRef } from '@nestjs/common';
import { MangaService } from './manga.service';
import { MangaMonitorService } from './manga.monitor.service';
import { MalModule } from '../mal/mal.module';
import { PrismaModule } from '../prisma/prisma.module';
import { DiscordModule } from '../discord/discord.module';
import { MangaUpdatesModule } from '../manga-updates/manga-updates.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [
    PrismaModule,
    MalModule,
    MangaUpdatesModule,
    forwardRef(() => DiscordModule),
    WhatsappModule,
  ],
  providers: [MangaService, MangaMonitorService],
  exports: [MangaService],
})
export class MangaModule {}
