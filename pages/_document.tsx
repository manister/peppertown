import { Html, Head, Main, NextScript } from 'next/document'

const Document = (): JSX.Element => (
  <Html lang="en">
    <Head>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="crossorigin" />
      <link href="https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@400;700&family=Open+Sans&display=swap" rel="stylesheet" />
    </Head>
    <body className="bg-slate-50">
      <Main />

      <NextScript />
    </body>
  </Html>
)

export default Document
