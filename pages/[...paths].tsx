import { GetStaticPaths, GetStaticProps } from 'next'

import Head from 'next/head'

import { ParsedUrlQuery } from 'querystring'
import React from 'react'

import CultivarListing from '~/components/cultivars/CultivarListing'
import FullCultivarProfile from '~/components/cultivars/FullCultivarProfile'
import Layout from '~/components/layout/Layout'
import LinkTo from '~/components/global/LinkTo'

import ReactMarkdown from 'react-markdown'
import Breadcrumbs from '~/components/global/Breadcrumbs'
import Banner from '~/components/global/Banner'
import {
  getAllCultivars,
  getAllOrigins,
  getAllSpecies,
  getConfig,
  getCultivarCount,
  getCultivars,
  getRelatedCultivars,
  getSingleCultivar,
} from '~/lib/actions/db-actions'
import { chunk, determineRequestType, pathToPathsAndSortAndPage } from '~/lib/calculations/helpers'
import { dataToFilterSchema, filterArrayToPrismaWhere, pathArrayToFilterArray, sortToSortPath } from '~/lib/calculations/filters-sort'
import { getStaticPageContent } from '~/lib/actions/pageData/getStaticPageContent'

type TListingPageProps = {
  listingPageData: IListingPageData
  requestType: 'listing'
}

type TCultivarPageProps = {
  cultivarPageData: ICultivarPageData
  requestType: 'cultivar'
}

type Props = TListingPageProps | TCultivarPageProps

interface IParams extends ParsedUrlQuery {
  paths: string[] | undefined
}

const getCultivarPageData = async (paths: string[]): Promise<{ cultivar: ICultivar; relatedCultivars: ICultivar[] }> => {
  const handle = paths[1] as string
  const cultivar = await getSingleCultivar(handle)

  //try and get at least 4 related cultivars
  const relatedCultivars = await getRelatedCultivars(cultivar, 4)
  return { cultivar, relatedCultivars }
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
  //@TODO split up more
  const rawPaths = (params as IParams).paths
  const config = await getConfig()
  const { paths, sort, page } = pathToPathsAndSortAndPage(rawPaths ?? [], config.sortKeys)
  const requestType = determineRequestType(paths)

  if (requestType === 'cultivar') {
    const cultivarPageData: ICultivarPageData = await getCultivarPageData(paths)
    return {
      props: {
        cultivarPageData,
        listingPageData: null,
        requestType,
      },
      notFound: !cultivarPageData.cultivar,
      revalidate: false,
    }
  }

  const data = { species: await getAllSpecies(), origins: await getAllOrigins() }
  const schema = await dataToFilterSchema(data)
  const pageContent = getStaticPageContent(rawPaths ?? [])
  const filterPaths = paths.length > 1 ? chunk(paths) : []
  const filters = pathArrayToFilterArray(filterPaths, schema) ?? []
  const where = filters ? filterArrayToPrismaWhere(filters) : {}
  const cultivars = await getCultivars({ page, paginate: config.perPage, sort, where })
  const count = await getCultivarCount({ where })
  const totalPages = Math.ceil(count / config.perPage)
  const pagination = Array.from({ length: totalPages }, (_i, n) => n + 1).map((pageNo) => {
    return {
      pageNo,
      url: `${paths.join('/')}/${sortToSortPath(sort, config.sortKeys)}/${pageNo > 1 ? pageNo : ''}`,
    }
  })
  // const listingPageData: IListingPageData = await getListingPageData(paths)
  return {
    props: {
      cultivarPageData: null,
      listingPageData: {
        cultivars,
        filters,
        count,
        sort,
        sortKeys: config.sortKeys,
        page,
        pagination,
        pageContent,
      },
      requestType,
    },
    notFound: !cultivars || cultivars.length < 1,
    revalidate: false,
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
