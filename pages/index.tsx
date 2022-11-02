import { GetStaticProps } from 'next'

import React from 'react'
import ChilliListing from '~/components/chillies/ChillisListing'
import Layout from '~/components/layout/Layout'
import Head from 'next/head'

import { shuffle } from '~/lib/dataHelpers'
import LinkTo from '~/components/global/LinkTo'
import Button from '~/components/global/Button'
import Container from '~/components/layout/Container'
import Banner from '~/components/global/Banner'
import { getChilliData } from '~/lib/chilliData'

interface Props {
  chillies: ICultivar[]
}

export const getStaticProps: GetStaticProps = async () => {
  const chillies = await getChilliData()
  const todaysChillies = shuffle(chillies).slice(0, 8)
  return {
    props: { chillies: todaysChillies },
    revalidate: 86400,
  }
}

const HomePage: React.FunctionComponent<Props> = (props) => (
  <Layout>
    <Head>
      <title>Pepper town: All type of chilli pepper to explore</title>
      <meta name="description" content="Pepper town is the place to explore chilli peppers from all over the world." />
    </Head>
    <Banner backgroundImage={{ src: 'plant.jpg', alt: 'A chilli pepper plant with ripe peppers' }}>
      <h1>All types of chilli pepper to explore</h1>
      <p>
        Pepper town is the place to explore chilli peppers from all over the world. Explore all{' '}
        <em>
          <LinkTo className="text-white" href="/cultivars">
            cultivars
          </LinkTo>{' '}
          (cultivated varieties)
        </em>
        , or explore by country or region.
      </p>
    </Banner>
    <section className="py-10">
      <Container>
        <h2 className="mb-10 text-3xl font-bold bg-blue-700 text-white p-3 inline-block">Featured Chilli Peppers</h2>
        <ChilliListing chillies={props.chillies} />
        <section className="prose mx-auto px-2"></section>
        <div className="text-center py-2">
          <Button variant="primary">
            <LinkTo href="/cultivars">View All</LinkTo>
          </Button>
        </div>
      </Container>
    </section>
  </Layout>
)
export default HomePage
