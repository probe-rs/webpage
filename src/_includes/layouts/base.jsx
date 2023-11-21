import Navbar from "../templates/navbar.jsx";
import Footer from "../templates/footer.jsx";

export default ({ title, children, pageCss }, filters) => {
  return (
    <html lang="en" data-theme="light">
      <script
        type="text/javascript"
        src="/scripts/components/theme_switcher.js"
      />
      <script
        type="text/javascript"
        src="/scripts/components/search.js"
      />
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{`probe-rs - ${title}`}</title>

        <meta name="supported-color-schemes" content="light dark" />

        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />

        <link
          rel="preload"
          href="/fonts/inter.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/epilogue.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/jetbrains-mono.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        <link rel="stylesheet" href="/styles/critical.css" />
        <link rel="stylesheet" href="/styles/main.css" />

        {pageCss &&
          <link rel="stylesheet" href={`/styles/pages/${pageCss}`} />}

        <script src="/main.js" type="module"></script>

        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@docsearch/css@3.2.1/dist/style.css"
          integrity="sha256-brWyd+lKlaU/B5Lhqd/FUXyZQu4rVmbFRsP2E8S2CLw="
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Navbar />
        <div>
          {children}
        </div>
        <Footer />

        <script
          src="https://cdn.jsdelivr.net/npm/@docsearch/js@3.2.1/dist/umd/index.js"
          integrity="sha256-7XYP2JLQrbyOqBKrAn8sT3l8PG/v2j6C3A5EyBDp9to="
          crossOrigin="anonymous"
          defer
        >
        </script>
      </body>
    </html>
  );
};
