import { GetStaticPaths, GetStaticProps } from 'next'

import Head from 'next/head'

import { ParsedUrlQuery } from 'querystring'
import React from 'react'

import CultivarListing from '~/components/cultivars/CultivarListing'
import FullCultivarProfile from '~/components/cultivars/FullCultivarProfile'
import Layout from '~/components/layout/Layout'

import ReactMarkdown from 'react-markdown'
import Breadcrumbs from '~/components/global/Breadcrumbs'
import Banner from '~/components/global/Banner'
import { getAllCultivars, getAllOrigins, getAllSpecies } from '~/lib/actions/db-actions'
import { determineRequestType } from '~/lib/calculations/paths'
import { buildListingPageData } from '~/lib/actions/page-data/buildListingPageData'
import { buildStaticPageContent } from '~/lib/actions/page-data/buildStaticPageContent'
import { buildCultivarPageData } from '~/lib/actions/page-data/buildCultivarPageData'
import Link from 'next/link'

type TListingPageProps = {
  listingPageData: IListingPageData
  requestType: 'listing'
}

type TCultivarPageProps = {
  cultivarPageData: ICultivarPageData
  requestType: 'cultivar'
}

type Props = TListingPageProps | TCultivarPageProps | Record<string, never>

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
  if (!paths) {
    return {
      notFound: true,
      props: {},
    }
  }

  const requestType = determineRequestType(paths)

  if (requestType === 'cultivar') {
    const cultivarPageData: ICultivarPageData = await buildCultivarPageData(paths)
    return {
      props: {
        cultivarPageData,
        requestType,
      },
      notFound: !cultivarPageData.cultivar,
      revalidate: false,
    }
  }
  if (requestType === 'listing') {
    const listingPageData = await buildListingPageData(paths)
    const pageContent = buildStaticPageContent(paths)
    return {
      props: {
        listingPageData: {
          ...listingPageData,
          pageContent,
        },
        requestType,
      },
      notFound: !listingPageData.cultivars || listingPageData.cultivars.length < 1,
      revalidate: false,
    }
  }
  return {
    notFound: true,
    props: {},
  }
}

const Page = (props: Props): JSX.Element => {
  if (props.requestType === 'cultivar') {
    const { cultivar, relatedCultivars } = props.cultivarPageData
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

  if (props.requestType === 'listing') {
    const { cultivars, pageContent, filters, count, page, sort, sortKeys, pagination } = props.listingPageData
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
                    return (
                      <Link href={node.href}>
                        <>{node.children}</>
                      </Link>
                    )
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

        <CultivarListing
          {...(filters ? { filters } : {})}
          cultivars={cultivars}
          count={count}
          page={page}
          sort={sort}
          sortKeys={sortKeys}
          pagination={pagination}
        />
      </Layout>
    )
  }
  return <></>
}

export default Page
