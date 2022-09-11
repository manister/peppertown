import parse from 'html-react-parser'
import Head from 'next/head'
import CookieConsent from 'react-cookie-consent'
import Container from '~/components/layout/Container'

import Layout from '~/components/layout/Layout'

import { attributes, html } from '~/content/policies/cookies.md'

const Page: React.FunctionComponent = () => (
  <Layout showCookieConsent={false}>
    <Head>
      <title>{attributes.title}</title>
      <meta name="description" content={attributes.description} />
      <meta name="robots" content="noindex,nofollow" />
    </Head>
    <CookieConsent buttonText="Accept all and close" flipButtons enableDeclineButton declineButtonText="Reject non-essential">
      Please read our cookie policy and accept or reject the use of non-essential cookies.
    </CookieConsent>
    <Container className="py-10">
      <section className="prose">{parse(html)}</section>
    </Container>
  </Layout>
)
export default Page
