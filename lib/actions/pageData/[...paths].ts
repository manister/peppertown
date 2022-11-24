import { chunk, pathToPathsAndSortAndPage } from '../../calculations/helpers'
import { dataToFilterSchema, filterArrayToPrismaWhere, pathArrayToFilterArray } from '../../calculations/filters'
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

export const getCultivarPageDataFromPaths = async (rawPaths: string[]): Promise<ICultivarPageData> => {
  let cultivars: ICultivar[] = []
  let relatedCultivars: ICultivar[] = []
  let requestType: ICultivarPageData['requestType'] = null
  let count = 0
  const data = { species: await getAllSpecies(), origins: await getAllOrigins() }
  const schema = await dataToFilterSchema(data)
  let filters: IFilter[] | null = null
  const pageContent = getStaticPageContent(rawPaths)

  const { sort, page, paths } = pathToPathsAndSortAndPage(rawPaths)

  try {
    if (paths.length === 1 && paths[0] === 'cultivars') {
      //no paths, load all cultivars
      requestType = 'listing'
      filters = pathArrayToFilterArray([], schema)
      cultivars = await getCultivars({ page })
      count = await getCultivarCount()
    } else if (paths.length == 2 && paths[0] === 'cultivars') {
      //this is a handle page
      requestType = 'handle'
      const handle = paths[1] as string

      const cultivar = await getSingleCultivar(handle)
      cultivars = [cultivar]

      relatedCultivars = await getRelatedCultivars(cultivar, 4)

      //try and get at least 4 related cultivars
    } else if (paths.length > 1) {
      const filterPaths = chunk(paths)

      filters = pathArrayToFilterArray(filterPaths, schema)

      if (filters) {
        requestType = 'listing'
        const where = filterArrayToPrismaWhere(filters)
        const data = await getCultivars({ where, page, ...(sort ? { sort } : {}) })
        count = await getCultivarCount({ where })

        cultivars = data
      }
    }
  } catch (e) {
    console.error({ error: e })
  }
  return { cultivars, requestType, filters, count, page, sort, pageContent, relatedCultivars: relatedCultivars }
}
