import React from 'react'
import Layout from '~/components/layout/Layout'
import Head from 'next/head'
// import LinkTo from '~/components/global/LinkTo'

import Container from '~/components/layout/Container'

import { attributes, html } from '~/content/index.md'
import parse from 'html-react-parser'

const Page = (): JSX.Element => {
  return (
    <Layout>
      <Head>
        <title>{attributes.title}</title>
        <meta name="description" content={attributes.description} />
      </Head>
      <section className="py-10">
        <Container>
          <section className="prose">{parse(html)}</section>
        </Container>
      </section>
    </Layout>
  )
}
export default Page
