import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { AuthModule } from '../auth/auth.module';
import { EventsModule } from '../events/events.module';
import { CommandHandler } from './handlers/command.handler';
import { ModalHandler } from './handlers/modal.handler';
import { SelectMenuHandler } from './handlers/select-menu.handler';

@Module({
  imports: [AuthModule, EventsModule],
  providers: [
    DiscordService,
    CommandHandler,
    ModalHandler,
    SelectMenuHandler,
  ],
  exports: [DiscordService],
})
export class DiscordModule {}
