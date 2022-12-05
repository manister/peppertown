import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Emoji from '../global/Emoji'
import CultivarCard from './CultivarCard'
import CultivarFilters from './CultivarFilters'

import Container from '~/components/layout/Container'
import { schemaMarkupFromListOfCultivars } from '~/lib/calculations/schemaMarkup'
import HighlightText from '~/components/global/HighlightText'
import SchemaMarkup from '~/components/global/SchemaMarkup'

import LinkTo from '~/components/global/LinkTo'
import { filterArrayToPathArray, sortToSortPath } from '~/lib/calculations/filters-sort'
import Select from '~/components/global/Select'

interface Props {
  cultivars: ICultivar[]
  pagination?: IPaginationItem[]
  count?: number
  page?: number
  sort?: TSort
  filters?: IFilter[]
  sortKeys?: ISortKeyValue[]
}

const CultivarListing = (props: Props): JSX.Element => {
  const { cultivars, filters, page, count, pagination, sort, sortKeys } = props

  const [filtersOpen, setFiltersOpen] = useState(false)

  const router = useRouter()

  const structuredData = schemaMarkupFromListOfCultivars(cultivars, router.asPath)

  const totalPages = pagination?.length ?? 1

  const sortPath = sort && sortKeys ? sortToSortPath(sort, sortKeys) : ''

  const [selectedSortKey, setSelectedSortKey] = useState(sort)

  useEffect(() => {
    if (selectedSortKey && sortKeys) {
      const newSortPath = sortToSortPath(selectedSortKey, sortKeys)
      const filterPathArray = filters ? filterArrayToPathArray(filters) : []
      const filterPath = filterPathArray.flat().join('/')
      const newPath = `${filterPath ? filterPath : '/cultivars'}/${newSortPath}`
      if (newSortPath !== sortPath) {
        router.push(newPath)
      }
    }
  }, [filters, router, selectedSortKey, sortKeys, sortPath])

  return (
    <Container>
      <SchemaMarkup data={structuredData} />
      {filters && (
        <div className="flex justify-between my-3 px-2 items-start flex-wrap md:flex-nowrap">
          <div className="mb-4 md:mb-0">
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
            {sortKeys ? (
              <div className="mt-3 flex items-center">
                <label htmlFor="sort-select" className="block mr-1">
                  Sort:{' '}
                </label>
                <Select
                  id="sort-select"
                  className="w-64 mw-full"
                  value={JSON.stringify(selectedSortKey)}
                  onChange={(e) => setSelectedSortKey(JSON.parse(e.target.value))}
                >
                  {sortKeys.map((sortKey) =>
                    sortKey.dirs.map((dir) => {
                      const thisSort = { by: sortKey.objectKey, dir: dir.key }

                      return (
                        <option key={`${sortKey.column}=${dir.key}`} value={JSON.stringify(thisSort)}>
                          {dir.text}
                        </option>
                      )
                    })
                  )}
                </Select>
              </div>
            ) : (
              ''
            )}
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

      {filters && (
        <CultivarFilters currentSortPath={sortPath} setOpen={(val) => setFiltersOpen(val)} open={filtersOpen} filters={filters} />
      )}
      <ul className="flex flex-wrap">
        {cultivars.map((cultivar) => (
          <li className="xs:w-1/1 sm:w-1/2 md:w-1/3 xl:w-1/4 mb-6 px-2" key={cultivar.handle}>
            <CultivarCard {...cultivar} />
          </li>
        ))}
      </ul>
      <ul className="flex justify-center mb-3">
        {pagination && pagination.length > 1
          ? pagination.map(({ pageNo, url }) => {
              return (
                <li className="mx-1" key={pageNo}>
                  {pageNo === page ? <span className="underline">{pageNo}</span> : <LinkTo href={url}>{pageNo}</LinkTo>}
                </li>
              )
            })
          : ''}
      </ul>
    </Container>
  )
}

export default CultivarListing
