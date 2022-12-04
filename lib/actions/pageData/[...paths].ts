import { chunk, pathToPathsAndSortAndPage } from '../../calculations/helpers'
import { dataToFilterSchema, filterArrayToPrismaWhere, pathArrayToFilterArray, sortToSortPath } from '../../calculations/filters-sort'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {
  getAllOrigins,
  getAllSpecies,
  getCultivarCount,
  getCultivars,
  getRelatedCultivars,
  getSingleCultivar,
  getConfig,
} from '~/lib/actions/db-actions'

const getStaticPageContent = (paths: string[]): ICultivarPageData['pageContent'] => {
  //@TODO: make getting the page data into a standalone function
  const pageContent: ICultivarPageData['pageContent'] = {
    title: 'List of Chilli Pepper Culitvars',
    description: 'Explore chilli pepper cultivars',
    content: '',
    image: {
      src: 'page-chilli-placeholder.jpg',
      alt: 'Many red cultivars',
    },
  }
  if (paths?.length === 2) {
    try {
      const filePath = path.join(process.cwd(), `content/pages/${paths[0]}/${paths[1]}.md`)
      const fileExists = fs.existsSync(filePath)
      if (!fileExists) return pageContent
      const fileContents = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(fileContents)
      const { title, description, image, alt } = data as { title: string; description: string; image: string; alt: string }
      pageContent.title = title
      pageContent.description = description
      pageContent.content = content
      pageContent.image = {
        src: image,
        alt: alt,
      }
    } catch (e) {
      console.error(e)
      return pageContent
    }
  }
  return pageContent
}

//@TODO this whole thing needs simplifying and splitting up into different functions that
// return differently, they can they be called depending on the page type
// this whole thing is far too general
// one function for listing, one function for handle page will do nicely
export const getCultivarPageDataFromPaths = async (rawPaths: string[]): Promise<ICultivarPageData> => {
  const config = await getConfig()
  let cultivars: ICultivar[] = []
  let relatedCultivars: ICultivar[] = []
  let requestType: ICultivarPageData['requestType'] = null
  let count = 0
  const data = { species: await getAllSpecies(), origins: await getAllOrigins() }
  const schema = await dataToFilterSchema(data)
  let filters: IFilter[] | null = null
  const pageContent = getStaticPageContent(rawPaths)

  const { sort, page, paths } = pathToPathsAndSortAndPage(rawPaths, config.sortKeys)

  let pagination: IPaginationItem[] = []
  try {
    if (paths.length === 1 && paths[0] === 'cultivars') {
      //no paths, load all cultivars
      requestType = 'listing'
      filters = pathArrayToFilterArray([], schema)
      cultivars = await getCultivars({ page, paginate: config.perPage, sort, where: {} })
      count = await getCultivarCount()
      const totalPages = Math.ceil(count / config.perPage)
      pagination = Array.from({ length: totalPages }, (_i, n) => n + 1).map((pageNo) => {
        return {
          pageNo,
          url: `${paths.join('/')}/${sortToSortPath(sort, config.sortKeys)}/${pageNo > 1 ? pageNo : ''}`,
        }
      })
    } else if (paths.length == 2 && paths[0] === 'cultivars') {
      //this is a handle page
      requestType = 'handle'
      const handle = paths[1] as string

      const cultivar = await getSingleCultivar(handle)
      cultivars = [cultivar]

      //try and get at least 4 related cultivars
      relatedCultivars = await getRelatedCultivars(cultivar, 4)
    } else if (paths.length > 1) {
      const filterPaths = chunk(paths)

      filters = pathArrayToFilterArray(filterPaths, schema)

      if (filters) {
        requestType = 'listing'
        const where = filterArrayToPrismaWhere(filters)
        const data = await getCultivars({ where, page, sort, paginate: config.perPage })
        count = await getCultivarCount({ where })
        const totalPages = Math.ceil(count / config.perPage)

        pagination = Array.from({ length: totalPages }, (_i, n) => n + 1).map((pageNo) => {
          return {
            pageNo,
            url: `${paths.join('/')}/${sortToSortPath(sort, config.sortKeys)}/${pageNo > 1 ? pageNo : ''}`,
          }
        })
        cultivars = data
      }
    }
  } catch (e) {
    console.error({ error: e })
  }
  return { cultivars, requestType, filters, count, page, sort, pageContent, relatedCultivars, pagination, sortKeys: config.sortKeys }
}
