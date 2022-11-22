import { chunk, pathToPathsAndSortAndPage } from '../dataHelpers'
import { getFilterSchema, pathArrayToFilterArray } from '../filters'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { getChilliCount, getChilliData, getRelatedChillies, getSingleChilli } from '~/lib/chilliData'

const getStaticPageContent = (paths: string[]): ICultivarPageData['pageContent'] => {
  //@TODO: make getting the page data into a standalone function
  const pageContent: ICultivarPageData['pageContent'] = {
    title: 'List of Chilli Pepper Culitvars',
    description: 'Explore chilli pepper cultivars',
    content: '',
    image: {
      src: 'page-chilli-placeholder.jpg',
      alt: 'Many red chillies',
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

export const getChilliPageDataFromPaths = async (rawPaths: string[]): Promise<ICultivarPageData> => {
  let chillies: ICultivar[] = []
  let relatedChillies: ICultivar[] = []
  let requestType: ICultivarPageData['requestType'] = null
  let count = 0
  const schema = await getFilterSchema()
  let filters: IFilter[] | null = null
  const pageContent = getStaticPageContent(rawPaths)

  const { sort, page, paths } = pathToPathsAndSortAndPage(rawPaths)

  try {
    if (paths.length === 1 && paths[0] === 'cultivars') {
      //no paths, load all chillies
      requestType = 'listing'
      filters = pathArrayToFilterArray([], schema)
      chillies = await getChilliData({ page })
      count = await getChilliCount()
    } else if (paths.length == 2 && paths[0] === 'cultivars') {
      //this is a handle page
      requestType = 'handle'
      const handle = paths[1] as string

      const chilli = await getSingleChilli(handle)
      chillies = [chilli]

      relatedChillies = await getRelatedChillies(chilli, 4)

      //try and get at least 4 related chillies
    } else if (paths.length > 1) {
      const filterPaths = chunk(paths)

      filters = pathArrayToFilterArray(filterPaths, schema)

      if (filters) {
        requestType = 'listing'
        const data = await getChilliData({ filters, page, ...(sort ? { sort } : {}) })
        count = await getChilliCount({ filters })

        chillies = data
      }
    }
  } catch (e) {
    console.error({ error: e })
  }
  return { chillies, requestType, filters, count, page, sort, pageContent, relatedChillies: relatedChillies }
}
