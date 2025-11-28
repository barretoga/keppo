import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MangaService } from './manga.service';
import { MalService } from '../mal/mal.service';
import { MangaUpdatesService } from '../manga-updates/manga-updates.service';
import { DiscordService } from '../discord/discord.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class MangaMonitorService {
  private readonly logger = new Logger(MangaMonitorService.name);

  constructor(
    private readonly mangaService: MangaService,
    private readonly malService: MalService,
    private readonly mangaUpdatesService: MangaUpdatesService,
    @Inject(forwardRef(() => DiscordService))
    private readonly discordService: DiscordService,
    private readonly whatsappService: WhatsappService,
  ) {}

  /**
   * Check for manga updates every 6 hours
   */
  @Cron(CronExpression.EVERY_6_HOURS)
  async checkUpdates() {
    this.logger.log('Checking for manga updates...');

    try {
      const subscriptions = await this.mangaService.getAllSubscriptions();
      
      if (subscriptions.length === 0) {
        this.logger.log('No active subscriptions to check.');
        return;
      }

      this.logger.log(`Checking ${subscriptions.length} subscriptions...`);

      // Group by MAL ID to avoid duplicate API calls
      const uniqueMalIds = [...new Set(subscriptions.map((sub) => sub.malId))];

      for (const malId of uniqueMalIds) {
        const subs = subscriptions.filter(s => s.malId === malId);
        const title = subs[0].title;
        await this.checkMangaUpdate(malId, title, subs);
        
        // Rate limiting: wait 2 seconds between requests
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      this.logger.log('Manga update check completed.');
    } catch (error) {
      this.logger.error('Error checking manga updates:', error);
    }
  }

  /**
   * Check update for a specific manga
   */
  private async checkMangaUpdate(malId: number, title: string, subscriptions: any[]) {
    try {
      const currentChapter = await this.mangaUpdatesService.getLatestChapter(title);
      
      if (currentChapter === 0) {
        // API might return 0 if unknown or error
        return;
      }

      // Check each subscription for this manga
      for (const sub of subscriptions) {
        if (currentChapter > sub.lastChapter) {
          this.logger.log(`New chapter detected for ${sub.title}: ${currentChapter} (was ${sub.lastChapter})`);
          
          // Update database
          await this.mangaService.updateLastChapter(sub.id, currentChapter);
          
          // Send Discord notification
          await this.discordService.notifyMangaUpdate(
            sub.title,
            currentChapter,
            sub.coverImage,
            malId,
            sub.channelId,
          );

          // Send WhatsApp notification
          if (sub.user?.phoneNumber) {
            const message = `*New Chapter Released!*\n\n*${sub.title}*\nChapter ${currentChapter} is now available!`;
            await this.whatsappService.sendText(sub.user.phoneNumber, message);
          }
        }
      }
    } catch (error) {
      this.logger.error(`Failed to check update for manga ${title} (MAL ID: ${malId}):`, error);
    }
  }
}
