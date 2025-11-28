import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import parser from 'cron-parser';
import { DiscordService } from '../discord/discord.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private prisma: PrismaService,
    private discordService: DiscordService,
    private whatsappService: WhatsappService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.debug('Checking for events...');
    const events = await this.prisma.event.findMany({
      include: {
        user: true, // Include user data for creator information
      },
    });
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

  private async triggerEvent(event: any) {
    this.logger.log(`TRIGGERING EVENT: ${event.title} - ${event.description}`);
    await this.discordService.notifyEvent(event);

    if (event.user?.phoneNumber) {
      const message = `*Event Reminder*\n\n*${event.title}*\n${event.description || ''}`;
      await this.whatsappService.sendText(event.user.phoneNumber, message);
    }
  }
}
