import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export const getStaticPageContent = (paths: string[]): IListingPageData['pageContent'] => {
  //@TODO: make getting the page data into a standalone function
  const pageContent: IListingPageData['pageContent'] = {
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
