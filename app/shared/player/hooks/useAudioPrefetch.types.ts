export interface PrefetchOptions {
  maxCacheSize?: number;
  prefetchNext?: boolean;
  prefetchPrevious?: boolean;
  enabled?: boolean;
}

export interface PrefetchedAudio {
  url: string;
  blob?: Blob;
  objectUrl?: string;
  timestamp: number;
  size: number;
}
