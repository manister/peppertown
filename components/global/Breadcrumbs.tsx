import Link from 'next/link'
import SchemaMarkup from '~/components/global/SchemaMarkup'
import Container from '~/components/layout/Container'
import { schemaMarkupBreadcrumbsFromLinks } from '~/lib/calculations/schemaMarkup'

interface Props {
  links: { link: string; title: string }[]
}

const Breadcrumbs = (props: Props): JSX.Element => {
  const { links } = props
  const structuredData = schemaMarkupBreadcrumbsFromLinks(links)
  return (
    <nav aria-label="Breadcrumb" className="border-b border-gray-300 bg-white">
      <SchemaMarkup data={structuredData} />
      <Container>
        <ol className="inline-flex items-center py-2 my-4">
          {links.map((link, index) => (
            <li key={link.link} className="inline-flex items-center">
              <Link href={link.link} className="p-2 text-lg inline-flex items-center text-gray-700 hover:text-gray-900 hover:underline">
                {link.title}
              </Link>
              {index < links.length - 1 ? <span>&raquo;</span> : ''}
            </li>
          ))}
        </ol>
      </Container>
    </nav>
  )
}

export default Breadcrumbs
