/**
 * Manga Subscription Service
 * Manages manga subscriptions for users
 */

import { Injectable, Logger, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MalService } from '../mal/mal.service';
import { MangaUpdatesService } from '../manga-updates/manga-updates.service';
import { DiscordService } from '../discord/discord.service';

export interface CreateSubscriptionDto {
  userId: number;
  malId: number;
  channelId: string;
}

export interface MangaSubscriptionInfo {
  id: number;
  malId: number;
  title: string;
  coverImage?: string;
  lastChapter: number;
  channelId: string;
  createdAt: Date;
}

@Injectable()
export class MangaService {
  private readonly logger = new Logger(MangaService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly malService: MalService,
    private readonly mangaUpdatesService: MangaUpdatesService, // Injected MangaUpdatesService
    @Inject(forwardRef(() => DiscordService)) // Added DiscordService as per snippet
    private readonly discordService: DiscordService,
  ) {}

  /**
   * Create a new manga subscription
   */
  async createSubscription(userId: string, malId: number, channelId: string): Promise<MangaSubscriptionInfo> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { discordId: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Check if subscription already exists
      const existing = await this.prisma.mangaSubscription.findUnique({
        where: {
          malId_userId: {
            malId: malId,
            userId: user.id,
          },
        },
      });

      if (existing) {
        this.logger.warn(`Subscription already exists for user ${userId} and manga ${malId}`);
        
        // If existing subscription has 0 chapters, try to update it
        if (existing.lastChapter === 0) {
          const mangaDetails = await this.malService.getMangaDetails(malId);
          const latestChapter = await this.mangaUpdatesService.getLatestChapter(mangaDetails.title);
          
          if (latestChapter > 0) {
            await this.prisma.mangaSubscription.update({
              where: { id: existing.id },
              data: { lastChapter: latestChapter },
            });
            existing.lastChapter = latestChapter;
            this.logger.log(`Updated existing subscription ${existing.id} with latest chapter: ${latestChapter}`);
          }
        }
        
        return this.mapToSubscriptionInfo(existing);
      }

      // Get manga details from MAL API
      const mangaDetails = await this.malService.getMangaDetails(malId);

      // Use MangaUpdates to get the real latest chapter
      const latestChapter = await this.mangaUpdatesService.getLatestChapter(mangaDetails.title);

      // Create subscription
      const subscription = await this.prisma.mangaSubscription.create({
        data: {
          malId: malId,
          title: mangaDetails.title,
          coverImage: mangaDetails.coverImage,
          lastChapter: latestChapter || mangaDetails.chapters || 0,
          userId: user.id,
          channelId: channelId,
        },
      });

      this.logger.log(`Created subscription for manga "${mangaDetails.title}" (ID: ${malId}) for user ${userId}`);
      return this.mapToSubscriptionInfo(subscription);
    } catch (error) {
      this.logger.error(`Failed to create subscription: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get all subscriptions for a user
   */
  async getUserSubscriptions(userId: number): Promise<MangaSubscriptionInfo[]> {
    const subscriptions = await this.prisma.mangaSubscription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return subscriptions.map(this.mapToSubscriptionInfo);
  }

  /**
   * Delete a subscription
   */
  async deleteSubscription(subscriptionId: number, userId: number): Promise<void> {
    const subscription = await this.prisma.mangaSubscription.findFirst({
      where: {
        id: subscriptionId,
        userId,
      },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    await this.prisma.mangaSubscription.delete({
      where: { id: subscriptionId },
    });

    this.logger.log(`Deleted subscription ${subscriptionId} for user ${userId}`);
  }

  /**
   * Get all active subscriptions (for monitoring)
   */
  async getAllSubscriptions() {
    const subscriptions = await this.prisma.mangaSubscription.findMany({
      include: { user: true },
      orderBy: { updatedAt: 'asc' },
    });

    return subscriptions;
  }

  /**
   * Update last chapter count
   */
  async updateLastChapter(subscriptionId: number, chapterCount: number): Promise<void> {
    await this.prisma.mangaSubscription.update({
      where: { id: subscriptionId },
      data: { lastChapter: chapterCount },
    });

    this.logger.debug(`Updated last chapter for subscription ${subscriptionId} to ${chapterCount}`);
  }

  /**
   * Get subscription by ID
   */
  async getSubscriptionById(subscriptionId: number): Promise<MangaSubscriptionInfo | null> {
    const subscription = await this.prisma.mangaSubscription.findUnique({
      where: { id: subscriptionId },
    });

    return subscription ? this.mapToSubscriptionInfo(subscription) : null;
  }

  /**
   * Map Prisma model to DTO
   */
  private mapToSubscriptionInfo(subscription: any): MangaSubscriptionInfo {
    return {
      id: subscription.id,
      malId: subscription.malId,
      title: subscription.title,
      coverImage: subscription.coverImage,
      lastChapter: subscription.lastChapter,
      channelId: subscription.channelId,
      createdAt: subscription.createdAt,
    };
  }
}
