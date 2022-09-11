import React from 'react'
import Layout from '~/components/layout/Layout'
import Head from 'next/head'

import Container from '~/components/layout/Container'

import { attributes, html } from '~/content/index.md'
import parse from 'html-react-parser'

import { importAll } from '~/lib/webpackHelpers'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ParsedUrlQuery } from 'querystring'

const files = importAll(require.context('~/content/pages', true, new RegExp('^.*.(md)$'))) as Record<string, IMarkdownFile>

export const getStaticPaths: GetStaticPaths = () => {
  const paths = Object.keys(files)
  return {
    paths: paths.map((path) => ({ params: { slug: path } })),
    fallback: 'blocking',
  }
}
interface IParams extends ParsedUrlQuery {
  slug: string | undefined
}

interface Props {
  html: string
  attributes: Record<string, string>
}

export const getStaticProps: GetStaticProps<Props> = ({ params }) => {
  const { slug } = params as IParams
  if (slug) {
    const file = files[slug]
    if (file) {
      return {
        props: {
          html: file.html,
          attributes: file.attributes,
        },
      }
    }
  }
  return {
    notFound: true,
  }
}

const Page = (props: Props): JSX.Element => {
  const { html, attributes } = props
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
