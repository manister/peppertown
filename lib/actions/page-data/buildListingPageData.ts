import { getAllOrigins, getAllSpecies, getConfig, getCultivarCount, getCultivars } from '~/lib/actions/db-actions'
import { dataToFilterSchema, filterArrayToPrismaWhere, pathArrayToFilterArray, sortToSortPath } from '~/lib/calculations/filters-sort'
import { chunk } from '~/lib/calculations/helpers'
import { getFilterPathFromPaths, getPageFromPaths, getSortFromPaths } from '~/lib/calculations/paths'

export const buildListingPageData = async (paths: string[]): Promise<Omit<IListingPageData, 'pageContent'>> => {
  const config = await getConfig()
  const page = getPageFromPaths(paths)
  const sort = getSortFromPaths(paths, config.sortKeys)
  const filterPaths = getFilterPathFromPaths(paths)
  const schema = await dataToFilterSchema({
    species: await getAllSpecies(),
    origins: await getAllOrigins(),
  })
  const chunkedFilterPaths = filterPaths.length > 1 ? chunk(filterPaths) : []
  const filters = pathArrayToFilterArray(chunkedFilterPaths, schema) ?? []
  const where = filters ? filterArrayToPrismaWhere(filters) : {}
  const cultivars = await getCultivars({ page, paginate: config.perPage, sort, where })
  const count = await getCultivarCount({ where })
  const totalPages = Math.ceil(count / config.perPage)
  const pagination = Array.from({ length: totalPages }, (_i, n) => n + 1).map((pageNo) => {
    return {
      pageNo,
      url: `${filterPaths.join('/')}/${sortToSortPath(sort, config.sortKeys)}/${pageNo > 1 ? pageNo : ''}`,
    }
  })

  return {
    cultivars,
    filters,
    count,
    sort,
    sortKeys: config.sortKeys,
    page,
    pagination,
  }
}
