import { useState } from 'react'
import { useRouter } from 'next/router'
import Emoji from '../global/Emoji'
import CultivarCard from './CultivarCard'
import CultivarFilters from './CultivarFilters'

import Container from '~/components/layout/Container'
import { schemaMarkupFromListOfCultivars } from '~/lib/calculations/schemaMarkup'
import HighlightText from '~/components/global/HighlightText'
import SchemaMarkup from '~/components/global/SchemaMarkup'

import LinkTo from '~/components/global/LinkTo'
import { pathToPathsAndSortAndPage } from '~/lib/calculations/helpers'

interface Props {
  cultivars: ICultivar[]
  count?: number
  page?: number
  sort?: TSort
  filters?: IFilter[]
}

const CultivarListing = (props: Props): JSX.Element => {
  const { cultivars, filters, page, count } = props

  const [filtersOpen, setFiltersOpen] = useState(false)

  const { asPath, query, push } = useRouter()

  const structuredData = schemaMarkupFromListOfCultivars(cultivars, asPath)

  const totalPages = count ? Math.ceil(count / 12) : 1

  const { paths } = pathToPathsAndSortAndPage(Array.isArray(query.paths) ? query.paths : [])

  return (
    <Container>
      <SchemaMarkup data={structuredData} />
      {filters && (
        <div className="flex justify-between my-3 px-2 items-start">
          <div>
            <button
              className="p-2 font-bold bg-yellow underline md:no-underline md:hover:underline"
              type="button"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <span className="bg-white">
                <Emoji src="⚙️" />
              </span>{' '}
              Filters
            </button>
            {/* Sort by @TODO! 
            <select onChange={push()}>

            </select> */}
          </div>
          {typeof count !== 'undefined' && !isNaN(count) ? (
            <div>
              <HighlightText className="mb-3 bg-green-700">{count} Peppers Found</HighlightText>
              {totalPages > 1 ? (
                <div className="mb-3">
                  Page {page} of {totalPages}
                </div>
              ) : (
                ''
              )}
            </div>
          ) : (
            ''
          )}
        </div>
      )}

      {filters && <CultivarFilters setOpen={(val) => setFiltersOpen(val)} open={filtersOpen} filters={filters} />}
      <ul className="flex flex-wrap">
        {cultivars.map((cultivar) => (
          <li className="xs:w-1/1 sm:w-1/2 md:w-1/3 xl:w-1/4 mb-6 px-2" key={cultivar.handle}>
            <CultivarCard {...cultivar} />
          </li>
        ))}
      </ul>
      <ul className="flex justify-center mb-3">
        {totalPages > 1
          ? Array.from({ length: totalPages }, (_i, n) => n + 1).map((pageNo) => {
              return (
                <li className="mx-1" key={pageNo}>
                  {pageNo === page ? (
                    <span className="underline">{pageNo}</span>
                  ) : (
                    <LinkTo href={`${paths.join('/')}/${pageNo}`}>{pageNo}</LinkTo>
                  )}
                </li>
              )
            })
          : ''}
      </ul>
    </Container>
  )
}

export default CultivarListing