import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MangaUpdatesService {
  private readonly logger = new Logger(MangaUpdatesService.name);
  private readonly baseUrl = 'https://api.mangaupdates.com/v1';

  async searchSeries(query: string) {
    try {
      const response = await axios.post(`${this.baseUrl}/series/search`, {
        search: query,
      });
      
      // Filter for Manga type only
      return response.data.results
        .filter((item: any) => item.record.type === 'Manga')
        .map((item: any) => ({
          id: item.record.series_id,
          title: item.record.title,
          image: item.record.image?.url?.original,
          url: item.record.url,
          lastUpdated: item.record.last_updated?.timestamp,
        }));
    } catch (error) {
      this.logger.error(`Error searching series: ${error.message}`);
      return [];
    }
  }

  async getLatestChapter(title: string): Promise<number> {
    try {
      // Search for releases by title since series_id filter seems unreliable
      const response = await axios.post(`${this.baseUrl}/releases/search`, {
        search: title,
        per_page: 100, // Fetch enough to find the latest
      });

      const releases = response.data.results;
      
      // Filter by exact title match to avoid other series
      const relevantReleases = releases.filter(
        (r: any) => r.record.title.toLowerCase() === title.toLowerCase()
      );

      if (relevantReleases.length === 0) {
        return 0;
      }

      // Find the max chapter number
      let maxChapter = 0;
      for (const release of relevantReleases) {
        const chapterStr = release.record.chapter;
        // Handle ranges like "10-11" or "10.5"
        // We take the last number in a range, or the number itself
        const parts = chapterStr.split(/[-–]/); // Split by hyphen or en-dash
        const lastPart = parts[parts.length - 1];
        const chapterNum = parseFloat(lastPart);
        
        if (!isNaN(chapterNum) && chapterNum > maxChapter) {
          maxChapter = chapterNum;
        }
      }

      return maxChapter;
    } catch (error) {
      this.logger.error(`Error getting latest chapter for ${title}: ${error.message}`);
      return 0;
    }
  }
}
