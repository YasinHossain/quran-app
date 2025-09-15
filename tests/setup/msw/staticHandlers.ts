import { http, HttpResponse } from 'msw';

export const staticHandlers = [
  http.get('https://verses.quran.com/:path*', () => {
    return new HttpResponse(new Blob(), {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  }),
  http.get('https://cdn.quran.com/:path*', () => {
    return new HttpResponse(new Blob(), {
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    });
  }),
];
