import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import parser from 'cron-parser';
import { DiscordService } from '../discord/discord.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private prisma: PrismaService,
    private discordService: DiscordService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.debug('Checking for events...');
    const events = await this.prisma.event.findMany();
    const now = new Date();

    for (const event of events) {
      if (event.type === 'ONE_TIME' && event.date) {
        // Check if event is due (within the last minute)
        const eventDate = new Date(event.date);
        const diff = Math.abs(now.getTime() - eventDate.getTime());
        if (diff < 60000) { // 1 minute tolerance
           this.triggerEvent(event);
        }
      } else if (event.type === 'RECURRING' && event.cron) {
        try {
          const interval = parser.parse(event.cron);
          const prev = interval.prev();
          const diff = Math.abs(now.getTime() - prev.toDate().getTime());
           if (diff < 60000) {
             this.triggerEvent(event);
           }
        } catch (err) {
          this.logger.error(`Failed to parse cron for event ${event.id}: ${err.message}`);
        }
      }
    }
  }

  private triggerEvent(event: any) {
    this.logger.log(`TRIGGERING EVENT: ${event.title} - ${event.description}`);
    this.discordService.notifyEvent(event);
  }
}
