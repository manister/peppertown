import { Html, Head, Main, NextScript } from 'next/document'

const Document = (): JSX.Element => (
  <Html lang="en">
    <Head>
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
