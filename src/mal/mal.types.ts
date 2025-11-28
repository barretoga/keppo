/**
 * MyAnimeList API Type Definitions
 */

// Manga Search Response
export interface MalMangaSearchResponse {
  data: MalMangaNode[];
  paging: {
    next?: string;
    previous?: string;
  };
}

export interface MalMangaNode {
  node: {
    id: number;
    title: string;
    main_picture?: {
      medium: string;
      large: string;
    };
    alternative_titles?: {
      synonyms: string[];
      en: string;
      ja: string;
    };
    start_date?: string;
    end_date?: string;
    synopsis?: string;
    mean?: number;
    rank?: number;
    popularity?: number;
    num_list_users?: number;
    num_scoring_users?: number;
    nsfw?: string;
    genres?: Array<{ id: number; name: string }>;
    created_at?: string;
    updated_at?: string;
    media_type?: string;
    status?: string;
    num_volumes?: number;
    num_chapters?: number;
    authors?: Array<{
      node: {
        id: number;
        first_name: string;
        last_name: string;
      };
      role: string;
    }>;
  };
}

// Manga Details Response
export interface MalMangaDetails {
  id: number;
  title: string;
  main_picture?: {
    medium: string;
    large: string;
  };
  alternative_titles?: {
    synonyms: string[];
    en: string;
    ja: string;
  };
  start_date?: string;
  end_date?: string;
  synopsis?: string;
  mean?: number;
  rank?: number;
  popularity?: number;
  num_list_users?: number;
  num_scoring_users?: number;
  nsfw?: string;
  genres?: Array<{ id: number; name: string }>;
  created_at?: string;
  updated_at?: string;
  media_type?: string;
  status?: string;
  num_volumes?: number;
  num_chapters?: number;
  authors?: Array<{
    node: {
      id: number;
      first_name: string;
      last_name: string;
    };
    role: string;
  }>;
}

// Simplified Manga Info for Discord
export interface MangaInfo {
  id: number;
  title: string;
  coverImage?: string;
  chapters?: number;
  status?: string;
  synopsis?: string;
  mean?: number;
}

// API Error Response
export interface MalApiError {
  error: string;
  message: string;
}
