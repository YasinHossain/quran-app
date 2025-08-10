if (!self.define) {
  let e,
    a = {};
  const s = (s, c) => (
    (s = new URL(s + '.js', c).href),
    a[s] ||
      new Promise((a) => {
        if ('document' in self) {
          const e = document.createElement('script');
          ((e.src = s), (e.onload = a), document.head.appendChild(e));
        } else ((e = s), importScripts(s), a());
      }).then(() => {
        let e = a[s];
        if (!e) throw new Error(`Module ${s} didn’t register its module`);
        return e;
      })
  );
  self.define = (c, t) => {
    const f = e || ('document' in self ? document.currentScript.src : '') || location.href;
    if (a[f]) return;
    let i = {};
    const n = (e) => s(e, f),
      d = { module: { uri: f }, exports: i, require: n };
    a[f] = Promise.all(c.map((e) => d[e] || n(e))).then((e) => (t(...e), i));
  };
}
define(['./workbox-8232f3e4'], function (e) {
  'use strict';
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: '/_next/app-build-manifest.json', revision: '85c88652bf758816e88fd8a863891142' },
        {
          url: '/_next/static/RocI0Z-EHyZqnwjdYuQ6Z/_buildManifest.js',
          revision: '8e67c07053ed5abf215693f8a4dcdf1d',
        },
        {
          url: '/_next/static/RocI0Z-EHyZqnwjdYuQ6Z/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        { url: '/_next/static/chunks/218-1c1e084252c70698.js', revision: '1c1e084252c70698' },
        { url: '/_next/static/chunks/271-185df93ce6b2b224.js', revision: '185df93ce6b2b224' },
        { url: '/_next/static/chunks/305-c2618f8882fe75e5.js', revision: 'c2618f8882fe75e5' },
        { url: '/_next/static/chunks/349-379acf5b8efa2e9d.js', revision: '379acf5b8efa2e9d' },
        { url: '/_next/static/chunks/451-920147a83a86fa15.js', revision: '920147a83a86fa15' },
        { url: '/_next/static/chunks/4bd1b696-cf72ae8a39fa05aa.js', revision: 'cf72ae8a39fa05aa' },
        { url: '/_next/static/chunks/660-a7265c30cbf6995f.js', revision: 'a7265c30cbf6995f' },
        { url: '/_next/static/chunks/760-0b4604ab5308ee8b.js', revision: '0b4604ab5308ee8b' },
        { url: '/_next/static/chunks/783-00966938938693d5.js', revision: '00966938938693d5' },
        { url: '/_next/static/chunks/874-437a265a67d6cfee.js', revision: '437a265a67d6cfee' },
        { url: '/_next/static/chunks/8e1d74a4-3db8e00f4df3627d.js', revision: '3db8e00f4df3627d' },
        { url: '/_next/static/chunks/964-d6e2a37b7965f281.js', revision: 'd6e2a37b7965f281' },
        {
          url: '/_next/static/chunks/app/_not-found/page-dd8115defa1af443.js',
          revision: 'dd8115defa1af443',
        },
        {
          url: '/_next/static/chunks/app/dev/player/page-f66df22863c9e05d.js',
          revision: 'f66df22863c9e05d',
        },
        {
          url: '/_next/static/chunks/app/features/bookmarks/page-999f0065a2113899.js',
          revision: '999f0065a2113899',
        },
        {
          url: '/_next/static/chunks/app/features/layout-132f8d351a3dc573.js',
          revision: '132f8d351a3dc573',
        },
        {
          url: '/_next/static/chunks/app/features/search/page-cc58c354cf7e8dc2.js',
          revision: 'cc58c354cf7e8dc2',
        },
        {
          url: '/_next/static/chunks/app/features/surah/%5BsurahId%5D/page-48f6ad9453baef57.js',
          revision: '48f6ad9453baef57',
        },
        {
          url: '/_next/static/chunks/app/features/surah/layout-8294ba5ad7664ca4.js',
          revision: '8294ba5ad7664ca4',
        },
        {
          url: '/_next/static/chunks/app/tafsir/%5BsurahId%5D/%5BayahId%5D/page-f718e95d089d0ac2.js',
          revision: 'f718e95d089d0ac2',
        },
        {
          url: '/_next/static/chunks/app/tafsir/layout-f6fa1dd66d67c73d.js',
          revision: 'f6fa1dd66d67c73d',
        },
        {
          url: '/_next/static/chunks/app/layout-70de103809406ae4.js',
          revision: '70de103809406ae4',
        },
        {
          url: '/_next/static/chunks/app/not-found-47479d18be1868e1.js',
          revision: '47479d18be1868e1',
        },
        { url: '/_next/static/chunks/app/page-2f71e3babf4b0c3f.js', revision: '2f71e3babf4b0c3f' },
        { url: '/_next/static/chunks/framework-306aa0968ce8efc5.js', revision: '306aa0968ce8efc5' },
        { url: '/_next/static/chunks/main-app-69496ec153f69d22.js', revision: '69496ec153f69d22' },
        { url: '/_next/static/chunks/main-fc8e413626f69d5d.js', revision: 'fc8e413626f69d5d' },
        {
          url: '/_next/static/chunks/pages/_app-0a0020ddd67f79cf.js',
          revision: '0a0020ddd67f79cf',
        },
        {
          url: '/_next/static/chunks/pages/_error-03529f2c21436739.js',
          revision: '03529f2c21436739',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        { url: '/_next/static/chunks/webpack-a9147a887d059fe3.js', revision: 'a9147a887d059fe3' },
        { url: '/_next/static/css/22a4425a9914c391.css', revision: '22a4425a9914c391' },
        { url: '/_next/static/css/702501e2c7eadf18.css', revision: '702501e2c7eadf18' },
        {
          url: '/_next/static/media/26a46d62cd723877-s.woff2',
          revision: 'befd9c0fdfa3d8a645d5f95717ed6420',
        },
        {
          url: '/_next/static/media/2aa11a72f7f24b58-s.woff2',
          revision: '59f5e86fb9b155bcc6b9f471dc05974c',
        },
        {
          url: '/_next/static/media/2ff41235783e9f59-s.woff2',
          revision: '504f344ddd04b780804b667819758b15',
        },
        {
          url: '/_next/static/media/383a65b63658737d-s.woff2',
          revision: '95c7afa0995f4164d947d5e5f7ba90ac',
        },
        {
          url: '/_next/static/media/40381518f67e6cb9-s.p.woff2',
          revision: 'b213487eeaf7ff79f0a9b0da8f7b5d80',
        },
        {
          url: '/_next/static/media/55c55f0601d81cf3-s.woff2',
          revision: '43828e14271c77b87e3ed582dbff9f74',
        },
        {
          url: '/_next/static/media/581909926a08bbc8-s.woff2',
          revision: 'f0b86e7c24f455280b8df606b89af891',
        },
        {
          url: '/_next/static/media/6ccbd08e2acf4dae-s.woff2',
          revision: 'd3a96a954d048c13d2d0c95f92164bce',
        },
        {
          url: '/_next/static/media/7935f04143b7b6d6-s.p.woff2',
          revision: '13c39dd48eebe67dbe01dd38a4c104c9',
        },
        {
          url: '/_next/static/media/7c89872b5a4cb391-s.p.ttf',
          revision: 'a0eaf4f9024ba05c091e59d5eaccccee',
        },
        {
          url: '/_next/static/media/851d6cda6be6295e-s.p.ttf',
          revision: '69b34d79c363d51a674283e1dee486d3',
        },
        {
          url: '/_next/static/media/85fe2766c5e6072a-s.woff2',
          revision: '5f044a14bdc1a4a3e3633447acdcfdf2',
        },
        {
          url: '/_next/static/media/8a6e4d7cd15e805a-s.woff2',
          revision: '9a5c38f3a645899507ef48f15b250310',
        },
        {
          url: '/_next/static/media/8e9860b6e62d6359-s.woff2',
          revision: '01ba6c2a184b8cba08b0d57167664d75',
        },
        {
          url: '/_next/static/media/97e0cb1ae144a2a9-s.woff2',
          revision: 'e360c61c5bd8d90639fd4503c829c2dc',
        },
        {
          url: '/_next/static/media/b99c66827c129d12-s.p.ttf',
          revision: 'f2303a7a5a192a743a836b7d0b62e2fc',
        },
        {
          url: '/_next/static/media/df0a9ae256c0569c-s.woff2',
          revision: 'd54db44de5ccb18886ece2fda72bdfe0',
        },
        {
          url: '/_next/static/media/e4af272ccee01ff0-s.p.woff2',
          revision: '65850a373e258f1c897a2b3d75eb74de',
        },
        { url: '/fonts/Al-Mushaf.ttf', revision: '71d8e66dd1fb38467c987c8cdc0df5bc' },
        { url: '/fonts/Amiri.ttf', revision: 'a0eaf4f9024ba05c091e59d5eaccccee' },
        { url: '/fonts/KFGQPC-Uthman-Taha-Bold.ttf', revision: '64c780e074cf8348345c01f1ed164dda' },
        { url: '/fonts/KFGQPC-Uthman-Taha.ttf', revision: '69b34d79c363d51a674283e1dee486d3' },
        { url: '/fonts/LICENSES.md', revision: 'fb87c6fb6f45a61127bbcf0632f3bcbe' },
        { url: '/fonts/Lateef.ttf', revision: 'ba23831aff320af49ce48ab2bc6940cb' },
        { url: '/fonts/Me-Quran.ttf', revision: 'a79b204e9c3055c77f0d81921bd881c2' },
        { url: '/fonts/Noor-e-Hira.ttf', revision: 'fc15ead22c59617db8e742e5283b6f88' },
        { url: '/fonts/Noto Nastaliq Urdu.ttf', revision: 'f2303a7a5a192a743a836b7d0b62e2fc' },
        { url: '/fonts/Noto-Naskh-Arabic.ttf', revision: 'aa48720b29f33603c87eb7eb8a0f49f7' },
        { url: '/fonts/PDMS-Saleem-Quran.ttf', revision: 'e588c0e97c9016f425c2d4a42a872246' },
        { url: '/fonts/Scheherazade-New.ttf', revision: 'c7b18d4456913580d2ae31b155767c37' },
        { url: '/locales/bn/common.json', revision: '4bd13f5e713e2b1a5453be36df996629' },
        { url: '/locales/en/common.json', revision: '1f7fea6a2b33f6d405edf2b8a39ea974' },
        { url: '/locales/en/player.json', revision: '6f6ba6b8da5c4d28e80a3ef15a18e7ea' },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({ request: e, response: a, event: s, state: c }) =>
              a && 'opaqueredirect' === a.type
                ? new Response(a.body, { status: 200, statusText: 'OK', headers: a.headers })
                : a,
          },
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/api\.quran\.com\/api\/v4\/(chapters|juzs|verses\/by_(chapter|juz|page))/,
      new e.NetworkFirst({
        cacheName: 'api-cache',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 86400 }),
          new e.CacheableResponsePlugin({ statuses: [0, 200] }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /^\/fonts\/.*\.(?:woff2?|ttf|otf)$/,
      new e.CacheFirst({
        cacheName: 'font-cache',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 31536e3 }),
          new e.CacheableResponsePlugin({ statuses: [0, 200] }),
        ],
      }),
      'GET'
    ));
});
