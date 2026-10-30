/**
 * Small page with the Apollo Sandbox pointed at /graphql. The bundle comes from Apollo's
 * CDN; if it fails to load, the page shows a short hint instead of staying blank.
 */
export function renderApolloSandboxPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Apollo Sandbox · Digital Business Card API</title>
    <style>
      :root { color-scheme: light dark; }
      html, body { margin: 0; height: 100%; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; }
      #sandbox { height: 100%; }
      #fallback { display: none; max-width: 40rem; margin: 4rem auto; padding: 0 1.5rem; line-height: 1.6; }
      code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    </style>
  </head>
  <body>
    <div id="sandbox"></div>
    <div id="fallback">
      <h1>Digital Business Card API</h1>
      <p>
        The GraphQL endpoint is available at <code>/graphql</code>. Apollo Sandbox could not be
        loaded from the CDN in this browser: the API itself works and answers POST requests.
      </p>
      <p>Example query:</p>
      <pre><code>query {
  profile {
    fullName
    skills { name }
  }
}</code></pre>
    </div>

    <script src="https://embeddable-sandbox.cdn.apollographql.com/_latest/embeddable-sandbox.umd.production.min.js"></script>
    <script>
      (function mountSandbox() {
        if (!window.EmbeddedSandbox) {
          document.getElementById('sandbox').style.display = 'none';
          document.getElementById('fallback').style.display = 'block';
          return;
        }

        new window.EmbeddedSandbox({
          target: '#sandbox',
          initialEndpoint: window.location.origin + '/graphql',
          includeCookies: false,
        });
      })();
    </script>
  </body>
</html>`;
}
