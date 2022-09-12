import SchemaMarkup from '~/components/global/SchemaMarkup'
import Container from '~/components/layout/Container'
import { schemaMarkupBreadcrumbsFromLinks } from '~/lib/schemaMarkup'
import LinkTo from './LinkTo'

interface Props {
  links: { link: string; title: string }[]
}

const Breadcrumbs = (props: Props): JSX.Element => {
  const { links } = props
  const structuredData = schemaMarkupBreadcrumbsFromLinks(links)
  return (
    <Container>
      <SchemaMarkup data={structuredData} />

      <nav aria-label="Breadcrumb">
        <ol className="inline-flex items-center py-2 mt-4">
          {links.map((link, index) => (
            <li key={link.link} className="inline-flex items-center">
              <LinkTo href={link.link} className="p-2 text-lg inline-flex items-center text-gray-700 hover:text-gray-900 hover:underline">
                {link.title}
              </LinkTo>
              {index < links.length - 1 ? <span>&raquo;</span> : ''}
            </li>
          ))}
        </ol>
      </nav>
    </Container>
  )
}

export default Breadcrumbs
