import { ImageResponse } from 'next/og';

import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo/site';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          backgroundColor: '#0B1220',
          backgroundImage:
            'radial-gradient(900px circle at 18% 20%, rgba(16, 185, 129, 0.25), transparent 50%), radial-gradient(700px circle at 78% 65%, rgba(59, 130, 246, 0.20), transparent 55%)',
          color: '#FFFFFF',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 14,
            alignItems: 'center',
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #10B981, #3B82F6)',
              boxShadow: '0 18px 50px rgba(0,0,0,0.35)',
            }}
          />
          <div style={{ fontSize: 26, opacity: 0.92 }}>appquran.com</div>
        </div>

        <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -1, lineHeight: 1.05 }}>
          {SITE_NAME}
        </div>
        <div style={{ marginTop: 22, fontSize: 34, opacity: 0.92, lineHeight: 1.25, maxWidth: 920 }}>
          {SITE_DESCRIPTION}
        </div>

        <div style={{ marginTop: 44, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {['Read', 'Listen', 'Translations', 'Tafsir', 'Bookmarks'].map((label) => (
            <div
              key={label}
              style={{
                fontSize: 22,
                padding: '10px 14px',
                borderRadius: 999,
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.14)',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}

