import { GetStaticPaths, GetStaticProps } from 'next'

import Head from 'next/head'

import { ParsedUrlQuery } from 'querystring'
import React from 'react'

import ChilliListing from '~/components/chillies/ChillisListing'
import FullChilliProfile from '~/components/chillies/FullChilliProfile'
import Layout from '~/components/layout/Layout'
import LinkTo from '~/components/global/LinkTo'

import { getBasicDataFromAirtable, getChilliesFromAirtable } from '~/lib/airtable'
import { getChilliPageDataFromPaths } from '~/lib/page-data/[...paths]'

import ReactMarkdown from 'react-markdown'
import Breadcrumbs from '~/components/global/Breadcrumbs'
import Banner from '~/components/global/Banner'

type Props = IChilliPageData

interface IParams extends ParsedUrlQuery {
  paths: string[] | undefined
}

export const getStaticPaths: GetStaticPaths = async () => {
  const data = {
    cultivars: await getChilliesFromAirtable(),
    origin: await getBasicDataFromAirtable('origins'),
    species: await getBasicDataFromAirtable('species'),
  }

  const paths = Object.entries(data).flatMap(([key, items]) => {
    return items.map((item) => {
      return { params: { paths: [key, item.handle] } }
    })
  })
  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const { paths } = params as IParams
  const { chillies, requestType, filters, pageContent, relatedChillies } = await getChilliPageDataFromPaths(paths ?? [])

  return {
    props: {
      chillies,
      requestType,
      filters,
      pageContent,
      relatedChillies,
    },
    notFound: !chillies || chillies.length < 1,
    revalidate: false,
  }
}

const ChilliPage = ({ chillies, requestType, filters, pageContent, relatedChillies }: Props): JSX.Element => {
  if (requestType === 'listing') {
    return (
      <Layout>
        <Head>
          <title>{pageContent.title}</title>
          <meta name="description" content={pageContent.description} />
        </Head>

        <Banner backgroundImage={pageContent.image}>
          {pageContent.content ? (
            <ReactMarkdown
              components={{
                a: (node) => {
                  if (node.href) {
                    return <LinkTo href={node.href}>{node.children}</LinkTo>
                  }
                  return <>{node.children}</>
                },
              }}
            >
              {pageContent.content}
            </ReactMarkdown>
          ) : (
            <h1>{pageContent.title}</h1>
          )}
        </Banner>

        <Breadcrumbs
          links={[
            { title: 'Home', link: '/' },
            { title: 'Cultivars', link: '/cultivars' },
          ]}
        />

        <ChilliListing {...(filters ? { filters } : {})} chillies={chillies} />
      </Layout>
    )
  } else if (requestType === 'handle' && chillies.length > 0) {
    const chilli = chillies[0]
    if (!chilli) return <></>
    return (
      <Layout>
        <Head>
          <title>{chilli.name}</title>
          <meta name="description" content={`All about ${chilli.name}, a cultivar of Capsicum ${chilli.species[0]?.name}`} />
        </Head>
        <Breadcrumbs
          links={[
            { title: 'Home', link: '/' },
            { title: 'Cultivars', link: '/cultivars' },
            { title: chilli.name, link: `/cultivars/${chilli.handle}` },
          ]}
        />
        <FullChilliProfile chilli={chilli} relatedChillies={relatedChillies} />
      </Layout>
    )
  }

  return <></>
}

export default ChilliPage
