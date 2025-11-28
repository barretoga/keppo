import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserAlreadyExistsException } from '../discord/exceptions/discord.exceptions';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(email: string, pass: string) {
    const hashedPassword = await bcrypt.hash(pass, 10);
    try {
      return await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new UserAlreadyExistsException();
      }
      throw error;
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async linkDiscord(email: string, pass: string, discordId: string) {
    const user = await this.validateUser(email, pass);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.prisma.user.update({
      where: { id: user.id },
      data: { discordId },
    });
  }

  async findByDiscordId(discordId: string) {
    return this.prisma.user.findUnique({ where: { discordId } });
  }

  async validateDiscordUser(discordId: string) {
    return this.findByDiscordId(discordId);
  }
}
