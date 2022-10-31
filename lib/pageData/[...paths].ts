import { getChilliesFromAirtable } from '../airtable'
import { chunk, shuffle } from '../dataHelpers'
import { filterArrayToAirtableFilter, getFilterSchema, pathArrayToFilterArray } from '../filters'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export const getChilliPageDataFromPaths = async (paths: string[]): Promise<ICultivarPageData> => {
  let chillies: ICultivar[] = []
  let relatedChillies: ICultivar[] = []
  let requestType: ICultivarPageData['requestType'] = null
  const schema = await getFilterSchema()
  let filters: IFilter[] | null = null

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
      const fileContents = fs.readFileSync(path.join(process.cwd(), `content/pages/${paths[0]}/${paths[1]}.md`), 'utf-8')
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
    }
  }

  try {
    if (paths.length === 1 && paths[0] === 'cultivars') {
      //no paths, load all chillies
      requestType = 'listing'
      filters = pathArrayToFilterArray([], schema)

      chillies = await getChilliesFromAirtable()
    } else if (paths[0] === 'cultivars') {
      //this is a handle page
      requestType = 'handle'
      const filterFormula = `{handle}="${paths[1]}"`
      const data = await getChilliesFromAirtable({ filterFormula })
      chillies = data

      //try and get at least 4 related chillies
      const chilli = data[0]
      if (chilli) {
        const min = 4

        //same origin AND species
        relatedChillies.push(
          ...(await getChilliesFromAirtable({
            filterFormula: `AND(FIND("${chilli.species[0]?.handle}", {species/handle}), FIND("${chilli.origin[0]?.handle}", {origin/handle}), NOT({handle}="${chilli.handle}"))`,
          }))
        )

        //same origin
        if (relatedChillies.length < min) {
          relatedChillies.push(
            ...(await getChilliesFromAirtable({
              filterFormula: `AND(FIND("${chilli.origin[0]?.handle}", {origin/handle}), NOT({handle}="${chilli.handle}"))`,
            }))
          )
        }

        //same species
        if (relatedChillies.length < min) {
          relatedChillies.push(
            ...(await getChilliesFromAirtable({
              filterFormula: `AND(FIND("${chilli.species[0]?.handle}", {species/handle}), NOT({handle}="${chilli.handle}"))`,
            }))
          )
        }

        relatedChillies = [...new Map(relatedChillies.map((item) => [item.handle, item])).values()] // unique
        relatedChillies = shuffle(relatedChillies).slice(0, 4) // get random 4
      }
    } else if (paths.length > 1) {
      //do we have a sort by?
      const last = paths[paths.length - 1]
      const hasSort = last && last?.includes('sort:')
      let sort: { direction: 'asc' | 'desc'; field: string } | null = null

      if (hasSort) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_s, field, dir] = last.split(':')
        if (field && dir) {
          const direction: 'asc' | 'desc' = dir === 'asc' || dir === 'desc' ? dir : 'asc'
          sort = { field, direction }
        }
      }
      const filterPaths = chunk(hasSort ? paths.slice(0, -1) : paths)

      filters = pathArrayToFilterArray(filterPaths, schema)

      if (filters) {
        requestType = 'listing'
        const filterFormula = filterArrayToAirtableFilter(filters)
        const data = await getChilliesFromAirtable({ filterFormula, ...(sort ? { sort } : {}) })
        chillies = data
      }
    }
  } catch (e) {
    console.error({ error: e })
  }
  return { chillies, requestType, filters, pageContent, relatedChillies }
}
