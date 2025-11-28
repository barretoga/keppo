/**
 * MyAnimeList API Service
 * Handles all interactions with the MAL API
 */

import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import {
  MalMangaSearchResponse,
  MalMangaDetails,
  MangaInfo,
} from './mal.types';

@Injectable()
export class MalService {
  private readonly logger = new Logger(MalService.name);
  private readonly apiClient: AxiosInstance;
  private readonly baseUrl = 'https://api.myanimelist.net/v2';

  constructor(private readonly configService: ConfigService) {
    const clientId = this.configService.get<string>('MAL_CLIENT_ID');

    if (!clientId) {
      this.logger.warn('MAL_CLIENT_ID not configured. Manga features will be disabled.');
    }

    // Create axios instance with MAL API configuration
    this.apiClient = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'X-MAL-CLIENT-ID': clientId || '',
      },
      timeout: 10000,
    });
  }

  /**
   * Search for manga by query
   * @param query - Search term
   * @param limit - Maximum number of results (default: 10, max: 100)
   * @returns Array of manga search results
   */
  async searchManga(query: string, limit: number = 10): Promise<MangaInfo[]> {
    try {
      this.logger.debug(`Searching manga: "${query}" (limit: ${limit})`);

      const response = await this.apiClient.get<MalMangaSearchResponse>('/manga', {
        params: {
          q: query,
          limit: Math.min(limit, 100),
          fields: 'id,title,main_picture,num_chapters,status,synopsis,mean',
        },
      });

      const mangaList: MangaInfo[] = response.data.data.map((item) => ({
        id: item.node.id,
        title: item.node.title,
        coverImage: item.node.main_picture?.large || item.node.main_picture?.medium,
        chapters: item.node.num_chapters,
        status: item.node.status,
        synopsis: item.node.synopsis,
        mean: item.node.mean,
      }));

      this.logger.log(`Found ${mangaList.length} manga results for "${query}"`);
      return mangaList;
    } catch (error) {
      this.logger.error(`Failed to search manga: ${error.message}`, error.stack);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new HttpException(
            'MAL API authentication failed. Check MAL_CLIENT_ID.',
            HttpStatus.UNAUTHORIZED,
          );
        }
        if (error.response?.status === 429) {
          throw new HttpException(
            'MAL API rate limit exceeded. Please try again later.',
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }
      }

      throw new HttpException(
        'Failed to search manga. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get detailed information about a specific manga
   * @param malId - MyAnimeList manga ID
   * @returns Manga details
   */
  async getMangaDetails(malId: number): Promise<MangaInfo> {
    try {
      this.logger.debug(`Fetching manga details for ID: ${malId}`);

      const response = await this.apiClient.get<MalMangaDetails>(`/manga/${malId}`, {
        params: {
          fields: 'id,title,main_picture,num_chapters,status,synopsis',
        },
      });

      const manga: MangaInfo = {
        id: response.data.id,
        title: response.data.title,
        coverImage: response.data.main_picture?.large || response.data.main_picture?.medium,
        chapters: response.data.num_chapters,
        status: response.data.status,
        synopsis: response.data.synopsis,
      };

      this.logger.log(`Retrieved details for manga: ${manga.title}`);
      return manga;
    } catch (error) {
      this.logger.error(`Failed to get manga details for ID ${malId}: ${error.message}`, error.stack);

      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new HttpException(
          `Manga with ID ${malId} not found.`,
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        'Failed to get manga details. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get current chapter count for a manga
   * @param malId - MyAnimeList manga ID
   * @returns Current chapter count (0 if unknown)
   */
  async getCurrentChapterCount(malId: number): Promise<number> {
    try {
      const manga = await this.getMangaDetails(malId);
      return manga.chapters || 0;
    } catch (error) {
      this.logger.error(`Failed to get chapter count for manga ID ${malId}`, error.stack);
      return 0;
    }
  }

  /**
   * Check if MAL API is configured
   * @returns true if MAL_CLIENT_ID is set
   */
  isConfigured(): boolean {
    return !!this.configService.get<string>('MAL_CLIENT_ID');
  }
}
