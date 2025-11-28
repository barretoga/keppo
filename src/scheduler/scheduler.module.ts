import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { DiscordModule } from '../discord/discord.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [DiscordModule, WhatsappModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
