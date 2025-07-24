This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Setup

Copy `.env.example` to `.env` and adjust the values if necessary. The default configuration includes the Quran API base URL.

This project supports word-by-word translations in multiple languages, including a newly added Bengali option.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

- `QURAN_API_BASE_URL` sets the Quran API endpoint. It defaults to `https://api.quran.com/api/v4` if not provided.

## Updating Data

Regenerate the bundled Quran metadata with:

```bash
npx ts-node scripts/fetchData.ts
```

This downloads the latest surah and juz information into `data/surahs.json` and `data/juz.json`.

## Custom Arabic Fonts

Font files should be placed in `public/fonts/`. Add your `.woff2`, `.woff`, `.otf`, or `.ttf` files there so they are served by Next.js.

To make a font selectable in the application, edit `ARABIC_FONTS` in `app/context/SettingsContext.tsx` and add a new entry, for example:

```ts
{ name: "My Font", value: '"My Font", serif', category: "Uthmani" }
```

`name` determines the label shown in the UI, `value` is the CSS `font-family`, and `category` controls which tab the font appears under.

Only include fonts you are licensed to distribute. Keep any required attribution or license files with the font files inside `public/fonts/`.

## Progressive Web App

This project uses [`next-pwa`](https://github.com/shadowwalker/next-pwa) to add a service worker. When enabled, API responses for surahs, juz, and page requests as well as custom fonts from `public/fonts/` are cached so the Quran can be read offline.

The service worker is active in production builds by default. Set the environment variable `NEXT_DISABLE_PWA=true` during the build or runtime to disable it.

```bash
# disable the service worker
NEXT_DISABLE_PWA=true npm run build
```

Remove the variable to re-enable it.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Development

Before running tests or linting, execute `npm install` to install dev dependencies.

Run the linter:

```bash
npm run lint
```

Run the test suite:

```bash
npm test
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

This project is licensed under the [MIT License](LICENSE).

