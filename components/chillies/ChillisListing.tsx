import { useState } from 'react'
import { useRouter } from 'next/router'
import Emoji from '../global/Emoji'
import ChilliCard from './ChilliCard'
import ChilliFilters from './ChilliFilters'

import { ItemList, WithContext } from 'schema-dts'
import Container from '~/components/layout/Container'
import { schemaMarkupFromListOfChillies } from '~/lib/schemaMarkup'
import HighlightText from '~/components/global/HighlightText'
import SchemaMarkup from '~/components/global/SchemaMarkup'

interface Props {
  chillies: IChilli[]
  filters?: IFilter[]
}

const ChilliListing = (props: Props): JSX.Element => {
  const { chillies, filters } = props

  const [filtersOpen, setFiltersOpen] = useState(false)

  const { asPath } = useRouter()

  const structuredData = schemaMarkupFromListOfChillies(chillies, asPath)

  return (
    <Container>
      <SchemaMarkup data={structuredData} />
      {filters && (
        <div className="flex justify-between my-3 px-2 items-center">
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
          <HighlightText className="my-3 bg-green-700">{chillies.length} Peppers Found</HighlightText>
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
