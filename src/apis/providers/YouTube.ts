import { google, youtube_v3 } from 'googleapis';
import { duration } from 'moment';
import { config } from '../../config';
import { ItemNotFoundError } from '../../errors/api';
import {
  ExternalAPI, ExternalTrack, MediaProvider, TrackSearchParams,
} from './base';

const api = google.youtube('v3');
const apiKey = config.YOUTUBE_API_KEY;

export class YouTubeAPI extends ExternalAPI {
  /**
   * Formats data from the YouTube video API to our own internal format
   * @param video The video data to format
   * @returns The video in our own standard format
   */
  formatTrack(video: youtube_v3.Schema$Video) {
    const data = {
      provider: MediaProvider.YouTube,
      providerId: video.id,
      name: video.snippet?.title,
      artists: [
        {
          provider: MediaProvider.YouTube,
          providerId: video.snippet?.channelId,
          name: video.snippet?.channelTitle,
        },
      ],
      duration: duration(video.contentDetails?.duration).asMilliseconds(),
      image: video.snippet?.thumbnails?.default?.url,
    } as ExternalTrack;
    return data;
  }

  async getTrack(id: string): Promise<ExternalTrack> {
    const result = await this.getTracks([id]);
    if (result.length !== 1) {
      throw new ItemNotFoundError('Track');
    }
    return result[0];
  }

  async getTracks(ids: string[]): Promise<ExternalTrack[]> {
    const result = await api.videos.list({
      part: ['snippet', 'contentDetails'],
      id: ids,
      key: apiKey,
    });
    if (result.data.items && result.data.items.length > 0) {
      return result.data.items.map((video) => this.formatTrack(video));
    }
    return [];
  }

  async searchTracks(params: TrackSearchParams): Promise<ExternalTrack[]> {
    const result = await api.search.list({
      part: ['snippet'],
      q: params.q,
      key: apiKey,
      maxResults: 10,
    });
    if (result.data.items && result.data.items.length > 0) {
      const ids = result.data.items.map((video) => video.id?.videoId as string);
      return this.getTracks(ids);
    }
    return [];
  }
}
