import { GetStaticPaths, GetStaticProps } from 'next'

import Head from 'next/head'

import { ParsedUrlQuery } from 'querystring'
import React from 'react'

import CultivarListing from '~/components/cultivars/CultivarListing'
import FullCultivarProfile from '~/components/cultivars/FullCultivarProfile'
import Layout from '~/components/layout/Layout'
import LinkTo from '~/components/global/LinkTo'

import { getCultivarPageDataFromPaths } from '~/lib/actions/pageData/[...paths]'

import ReactMarkdown from 'react-markdown'
import Breadcrumbs from '~/components/global/Breadcrumbs'
import Banner from '~/components/global/Banner'
import { getAllCultivars, getAllOrigins, getAllSpecies } from '~/lib/actions/db-actions'

type Props = ICultivarPageData

interface IParams extends ParsedUrlQuery {
  paths: string[] | undefined
}

export const getStaticPaths: GetStaticPaths = async () => {
  const data = {
    cultivars: await getAllCultivars(),
    origin: await getAllOrigins(),
    species: await getAllSpecies(),
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
  const { cultivars, requestType, page, sort, filters, pageContent, relatedCultivars, count } = await getCultivarPageDataFromPaths(
    paths ?? []
  )

  return {
    props: {
      cultivars,
      requestType,
      count,
      page,
      sort,
      filters,
      pageContent,
      relatedCultivars,
    },
    notFound: !cultivars || cultivars.length < 1,
    revalidate: false,
  }
}

const CultivarPage = ({ cultivars, requestType, count, page, sort, filters, pageContent, relatedCultivars }: Props): JSX.Element => {
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

        <CultivarListing {...(filters ? { filters } : {})} cultivars={cultivars} count={count} page={page} sort={sort} />
      </Layout>
    )
  } else if (requestType === 'handle' && cultivars.length > 0) {
    const cultivar = cultivars[0]
    if (!cultivar) return <></>
    return (
      <Layout>
        <Head>
          <title>{cultivar.name}</title>
          <meta name="description" content={`All about ${cultivar.name}, a cultivar of Capsicum ${cultivar.species?.name}`} />
        </Head>
        <Breadcrumbs
          links={[
            { title: 'Home', link: '/' },
            { title: 'Cultivars', link: '/cultivars' },
            { title: cultivar.name, link: `/cultivars/${cultivar.handle}` },
          ]}
        />
        <FullCultivarProfile cultivar={cultivar} relatedCultivars={relatedCultivars} />
      </Layout>
    )
  }

  return <></>
}

export default CultivarPage
