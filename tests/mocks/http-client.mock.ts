import { IHttpClient } from '../../src/infrastructure/api/QuranApiClient';

/**
 * Mock HTTP client for testing API interactions
 */
export class MockHttpClient implements IHttpClient {
  private responses = new Map<string, any>();
  private requestLog: Array<{ method: string; url: string; data?: any; options?: RequestInit }> =
    [];
  private delayMs: number = 0;
  private shouldFail: boolean = false;
  private failureError: Error = new Error('Mock HTTP request failed');

  /**
   * Set a mock response for a specific URL
   */
  setResponse(url: string, response: any): void {
    this.responses.set(url, response);
  }

  /**
   * Set mock responses for multiple URLs
   */
  setResponses(responses: Record<string, any>): void {
    Object.entries(responses).forEach(([url, response]) => {
      this.responses.set(url, response);
    });
  }

  /**
   * Set delay for all requests (simulates network latency)
   */
  setDelay(delayMs: number): void {
    this.delayMs = delayMs;
  }

  /**
   * Make all subsequent requests fail
   */
  setShouldFail(shouldFail: boolean, error?: Error): void {
    this.shouldFail = shouldFail;
    if (error) {
      this.failureError = error;
    }
  }

  /**
   * Get log of all requests made
   */
  getRequestLog(): Array<{ method: string; url: string; data?: any; options?: RequestInit }> {
    return [...this.requestLog];
  }

  /**
   * Get the last request made
   */
  getLastRequest(): { method: string; url: string; data?: any; options?: RequestInit } | null {
    return this.requestLog[this.requestLog.length - 1] || null;
  }

  /**
   * Clear all mock data and logs
   */
  reset(): void {
    this.responses.clear();
    this.requestLog = [];
    this.delayMs = 0;
    this.shouldFail = false;
    this.failureError = new Error('Mock HTTP request failed');
  }

  /**
   * Get number of requests made to a specific URL
   */
  getRequestCount(url?: string): number {
    if (!url) {
      return this.requestLog.length;
    }
    return this.requestLog.filter((req) => req.url === url).length;
  }

  private async simulateRequest<T>(
    method: string,
    url: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> {
    // Log the request
    this.requestLog.push({ method, url, data, options });

    // Simulate delay
    if (this.delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.delayMs));
    }

    // Check if should fail
    if (this.shouldFail) {
      throw this.failureError;
    }

    // Get mock response
    const response = this.responses.get(url);
    if (response === undefined) {
      throw new Error(`No mock response configured for ${method} ${url}`);
    }

    // Return the mock response
    return response;
  }

  async get<T>(url: string, options?: RequestInit): Promise<T> {
    return this.simulateRequest<T>('GET', url, undefined, options);
  }

  async post<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
    return this.simulateRequest<T>('POST', url, data, options);
  }

  async put<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
    return this.simulateRequest<T>('PUT', url, data, options);
  }

  async delete<T>(url: string, options?: RequestInit): Promise<T> {
    return this.simulateRequest<T>('DELETE', url, undefined, options);
  }
}

/**
 * Factory for creating commonly used mock HTTP clients
 */
export class MockHttpClientFactory {
  /**
   * Creates a mock client with successful responses pre-configured
   */
  static createSuccessful(): MockHttpClient {
    const client = new MockHttpClient();

    // Pre-configure common successful responses
    client.setResponses({
      'https://api.quran.com/api/v4/verses/by_chapter/1?verse_number=1': {
        verses: [
          {
            id: '1:1',
            verse_number: 1,
            chapter_id: 1,
            verse_key: '1:1',
            text_uthmani: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
            text_simple: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
          },
        ],
      },
      'https://api.quran.com/api/v4/chapters/1': {
        chapter: {
          id: 1,
          name_simple: 'Al-Fatiha',
          name_complex: 'Al-Fātiḥah',
          name_arabic: 'الفاتحة',
          verses_count: 7,
          revelation_place: 'makkah',
        },
      },
      'https://api.quran.com/api/v4/chapters': {
        chapters: [
          {
            id: 1,
            name_simple: 'Al-Fatiha',
            name_arabic: 'الفاتحة',
            verses_count: 7,
            revelation_place: 'makkah',
          },
          {
            id: 2,
            name_simple: 'Al-Baqarah',
            name_arabic: 'البقرة',
            verses_count: 286,
            revelation_place: 'madinah',
          },
        ],
      },
    });

    return client;
  }

  /**
   * Creates a mock client that simulates slow network
   */
  static createSlow(delayMs: number = 2000): MockHttpClient {
    const client = MockHttpClientFactory.createSuccessful();
    client.setDelay(delayMs);
    return client;
  }

  /**
   * Creates a mock client that fails all requests
   */
  static createFailing(error?: Error): MockHttpClient {
    const client = new MockHttpClient();
    client.setShouldFail(true, error);
    return client;
  }

  /**
   * Creates a mock client that returns empty results
   */
  static createEmpty(): MockHttpClient {
    const client = new MockHttpClient();
    client.setResponses({
      'https://api.quran.com/api/v4/verses/by_chapter/999?verse_number=999': { verses: [] },
      'https://api.quran.com/api/v4/search?q=nonexistent': { search: { results: [] } },
      'https://api.quran.com/api/v4/chapters/999': { chapter: null },
    });
    return client;
  }

  /**
   * Creates a mock client with rate limiting simulation
   */
  static createRateLimited(): MockHttpClient {
    const client = new MockHttpClient();
    let requestCount = 0;

    const originalGet = client.get.bind(client);
    client.get = async function <T>(url: string, options?: RequestInit): Promise<T> {
      requestCount++;
      if (requestCount > 100) {
        // Simulate rate limit after 100 requests
        throw new Error('Rate limit exceeded');
      }
      return originalGet(url, options);
    };

    return client;
  }

  /**
   * Creates a mock client that simulates network errors intermittently
   */
  static createUnreliable(failureRate: number = 0.3): MockHttpClient {
    const client = MockHttpClientFactory.createSuccessful();

    const originalGet = client.get.bind(client);
    client.get = async function <T>(url: string, options?: RequestInit): Promise<T> {
      if (Math.random() < failureRate) {
        throw new Error('Network error');
      }
      return originalGet(url, options);
    };

    return client;
  }
}
