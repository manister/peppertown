import { GetStaticProps } from 'next'

import React from 'react'
import CultivarListing from '~/components/cultivars/CultivarListing'
import Layout from '~/components/layout/Layout'
import Head from 'next/head'

import { shuffle } from '~/lib/calculations/helpers'
import Button from '~/components/global/Button'
import Container from '~/components/layout/Container'
import Banner from '~/components/global/Banner'
import { getAllCultivars } from '~/lib/actions/db-actions'
import Link from 'next/link'

interface Props {
  cultivars: ICultivar[]
}

export const getStaticProps: GetStaticProps = async () => {
  const cultivars = await getAllCultivars()
  const todaysCultivars = shuffle(cultivars).slice(0, 8)
  return {
    props: { cultivars: todaysCultivars },
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
          <Link className="text-white" href="/cultivars">
            cultivars
          </Link>{' '}
          (cultivated varieties)
        </em>
        , or explore by country or region.
      </p>
    </Banner>
    <section className="py-10">
      <Container>
        <h2 className="mb-10 text-3xl font-bold bg-blue-700 text-white p-3 inline-block">Featured Chilli Peppers</h2>
        <CultivarListing cultivars={props.cultivars} />
        <section className="prose mx-auto px-2"></section>
        <div className="text-center py-2">
          <Button variant="primary">
            <Link href="/cultivars">View All</Link>
          </Button>
        </div>
      </Container>
    </section>
  </Layout>
)
export default HomePage
