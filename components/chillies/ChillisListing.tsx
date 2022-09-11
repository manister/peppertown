import { useState } from 'react'
import { useRouter } from 'next/router'
import Emoji from '../global/Emoji'
import ChilliCard from './ChilliCard'
import ChilliFilters from './ChilliFilters'

import { ItemList, WithContext } from 'schema-dts'
import Container from '~/components/layout/Container'

type Props = {
  chillies: IChilli[]
  filters?: IFilter[]
}

const ChilliListing = (props: Props): JSX.Element => {
  const { chillies, filters } = props

  const [filtersOpen, setFiltersOpen] = useState(false)

  const { asPath } = useRouter()

  const structuredData: WithContext<ItemList> = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: `https://pepper.town${asPath}`,
    numberOfItems: chillies.length,
    name: 'List of chilli peppers',
    alternateName: ['List of chili peppers', 'List of hot peppers', 'List of chillies'],
    itemListElement: chillies.map((chilli) => {
      return {
        '@context': 'https://schema.org',
        '@type': 'Taxon',
        taxonRank: 'Cultivar',
        name: chilli.name,
        parentTaxon: {
          '@context': 'https://schema.org',
          '@type': 'Taxon',
          taxonRank: 'Species',
          name: `Capsicum ${chilli.species[0]?.name}`,
          sameAs: [`https://species.wikimedia.org/wiki/Capsicum_${chilli.species[0]?.handle}`],
          parentTaxon: {
            '@context': 'https://schema.org',
            '@type': 'Taxon',
            taxonRank: 'Genus',
            sameAs: ['https://species.wikimedia.org/wiki/Capsicum', 'https://www.wikidata.org/wiki/Q165199'],
            name: 'Capsicum',
            alternateName: ['Chilli', 'Chili', 'Chilli Pepper', 'Chili Pepper', 'Hot Pepper'],
          },
        },
      }
    }),
  }

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {filters && (
        <div className="flex justify-between my-3 px-2 items-center">
          <button className="p-2 font-bold bg-yellow" type="button" onClick={() => setFiltersOpen(!filtersOpen)}>
            <span className="bg-white">
              <Emoji src="⚙️" />
            </span>{' '}
            Filters
          </button>
          <p className="my-3 italic text-white p-2 font-bold bg-green-700">{chillies.length} Peppers Found</p>
        </div>
      )}

      {filters && <ChilliFilters setOpen={(val) => setFiltersOpen(val)} open={filtersOpen} filters={filters} />}
      <ul className="flex flex-wrap">
        {chillies.map((chilli) => (
          <li className="xs:w-1/1 sm:w-1/2 md:w-1/3 xl:w-1/4 mb-6 px-2" key={chilli.handle}>
            <ChilliCard {...chilli} />
          </li>
        ))}
      </ul>
    </Container>
  )
}

export default ChilliListing
