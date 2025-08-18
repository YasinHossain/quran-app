# Quran App

Quran App is a Next.js 14 web reader for Quran surahs and translations.

Features:

- Offline reading with PWA support
- Multiple translations and word-by-word study
- Audio playback for recitations
- Custom Arabic fonts

For an overview of the folder structure see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Setup

Copy `.env.example` to `.env` and adjust the values if necessary. The default configuration includes the Quran API base URL.

This repository includes an `.nvmrc` file that pins the Node.js version to **20**. Run `nvm use` after cloning to ensure you're using the correct version.
The application requires **Node.js 20 or higher**.

You can also develop using a [Dev Container](https://containers.dev/). Open the project in a Dev Container to automatically use Node.js 20 with ESLint and Prettier extensions installed.

This project supports word-by-word translations in multiple languages. Available options include English, Bangla, Urdu, Hindi, Bahasa Indonesia, Persian, Turkish and Tamil.

Run `npm run format` after installing dependencies to ensure consistent code style.
An `.editorconfig` file defines UTF-8 encoding, two-space indentation, and a newline at the end of files.

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

## Dev Pages

Experimental development pages live under `app/(dev)` and are not included in production builds.
Start the development server and navigate to the desired path:

```bash
npm run dev
# open http://localhost:3000/dev/player
```

These routes are intended for local testing and may change without notice.

## Environment Variables

- `QURAN_API_BASE_URL` sets the Quran API endpoint. It defaults to `https://api.quran.com/api/v4` if not provided.

## Updating Data

Regenerate the bundled Quran metadata with:

```bash
npx ts-node scripts/fetchData.ts
```

This downloads the latest juz information into `data/juz.json`. Surah metadata is fetched from the Quran.com API at runtime.

## Custom Arabic Fonts

Font files should be placed in `public/fonts/`. Add your `.woff2`, `.woff`, `.otf`, or `.ttf` files there so they are served by Next.js.

To make a font selectable in the application, edit `ARABIC_FONTS` in `app/providers/settingsStorage.ts` and add a new entry, for example:

```ts
{ name: "My Font", value: '"My Font", serif', category: "Uthmani" }
```

`name` determines the label shown in the UI, `value` is the CSS `font-family`, and `category` controls which tab the font appears under.

Only include fonts you are licensed to distribute. Keep any required attribution or license files with the font files inside `public/fonts/`.
Font licenses for the fonts shipped with this project are documented in [public/fonts/LICENSES.md](public/fonts/LICENSES.md).

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

Generate a coverage report:

```bash
npm run test:coverage
```

## Storybook

Run Storybook to iterate on UI components in isolation:

```bash
npm run storybook
```

This launches an interactive component workbench with a light/dark theme toggle driven by semantic tokens. Use it for quick AI-assisted design validation.

The CI workflow uploads this report as an artifact.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

We welcome contributions from the community. Please read our [CONTRIBUTING.md](CONTRIBUTING.md) guide to get started.
For a summary of the required workflow, see [AGENTS.md](AGENTS.md).
For debugging tips, see [docs/DEBUGGING.md](docs/DEBUGGING.md).

## License

This project is licensed under the [MIT License](LICENSE).
All bundled fonts are licensed separately; see [public/fonts/LICENSES.md](public/fonts/LICENSES.md) for details.

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing to ensure a welcoming and inclusive environment.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for recent updates.
