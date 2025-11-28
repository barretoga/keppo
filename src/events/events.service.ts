import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    let channelId = data.channelId;
    if (data.channelLink) {
      // Extract channel ID from link like https://discord.com/channels/GUILD_ID/CHANNEL_ID
      const parts = data.channelLink.split('/');
      const lastPart = parts[parts.length - 1];
      if (lastPart && /^\d+$/.test(lastPart)) {
        channelId = lastPart;
      }
    }

    const { channelLink, ...eventData } = data; // Remove channelLink from data passed to Prisma

    return this.prisma.event.create({
      data: {
        ...eventData,
        channelId,
      },
    });
  }

  findAll() {
    return this.prisma.event.findMany();
  }

  findOne(id: number) {
    return this.prisma.event.findUnique({ where: { id } });
  }

  update(id: number, data: Prisma.EventUpdateInput) {
    return this.prisma.event.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.event.delete({ where: { id } });
  }
}
