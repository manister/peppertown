import { AppWrapper } from '~/state/context'
import NextNProgress from 'nextjs-progressbar'

import { AppProps } from 'next/app'

import '~/css/tailwind.css'

import { getCookieConsentValue } from 'react-cookie-consent'

import { GoogleAnalytics } from 'nextjs-google-analytics'

const Application = ({ Component, pageProps }: AppProps): JSX.Element => {
  const consented = getCookieConsentValue()
  return (
    <AppWrapper>
      {consented === 'true' ? <GoogleAnalytics /> : null}
      <NextNProgress height={5} options={{ showSpinner: false }} />
      <Component {...pageProps} />
    </AppWrapper>
  )
}

export default Application
