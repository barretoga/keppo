import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { PrismaModule } from './prisma/prisma.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DiscordModule } from './discord/discord.module';
import { AuthModule } from './auth/auth.module';
import { MalModule } from './mal/mal.module';
import { MangaUpdatesModule } from './manga-updates/manga-updates.module';
import { MangaModule } from './manga/manga.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    EventsModule,
    PrismaModule,
    SchedulerModule,
    DiscordModule,
    AuthModule,
    MalModule,
    MangaUpdatesModule,
    MangaModule,
    WhatsappModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
