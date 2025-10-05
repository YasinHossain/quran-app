import { http, HttpResponse } from 'msw';

export const mediaHandlers = [
  http.get('https://verses.quran.com/:path*', () => {
    // Return a mock audio response (empty blob for tests)
    return new HttpResponse(new Blob(), {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  }),
  http.get('https://cdn.quran.com/:path*', () => {
    // Return a mock image response (empty blob for tests)
    return new HttpResponse(new Blob(), {
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    });
  }),
];
