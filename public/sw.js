// Import Babel standalone script if needed for direct static server environments (e.g. GitHub Pages)
try {
  importScripts("https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.24.7/babel.min.js");
} catch (e) {
  console.warn("Babel import skipped or offline", e);
}

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Intercept .ts and .tsx files from the same origin to transpile & serve with application/javascript MIME type
  if (url.origin === self.location.origin && (url.pathname.endsWith('.ts') || url.pathname.endsWith('.tsx'))) {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(url.origin + url.pathname);
          if (!response.ok) return response;

          const sourceCode = await response.text();

          // If Vite dev server already compiled this file, return it as-is
          if (sourceCode.includes('/@vite/client') || sourceCode.includes('__vite__')) {
            return new Response(sourceCode, {
              headers: {
                'Content-Type': 'application/javascript; charset=utf-8'
              }
            });
          }

          if (self.Babel) {
            const transpiledResult = self.Babel.transform(sourceCode, {
              presets: [
                ["react", { runtime: "automatic" }],
                ["typescript", { isTSX: true, allExtensions: true }]
              ],
              filename: url.pathname
            });

            if (transpiledResult && transpiledResult.code) {
              return new Response(transpiledResult.code, {
                headers: {
                  'Content-Type': 'application/javascript; charset=utf-8',
                  'X-Content-Type-Options': 'nosniff'
                }
              });
            }
          }

          // Fallback if Babel is not present: serve with javascript MIME type
          return new Response(sourceCode, {
            headers: {
              'Content-Type': 'application/javascript; charset=utf-8'
            }
          });
        } catch (e) {
          console.error('Service worker transpilation error for', url.pathname, e);
          return fetch(event.request);
        }
      })()
    );
  }
});
