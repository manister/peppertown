import React from 'react'
import ReactMarkdown from 'react-markdown'
import ChilliDetails from '~/components/chillies/ChilliDetails'
import ChilliListing from '~/components/chillies/ChillisListing'
import HighlightText from '~/components/global/HighlightText'
import ImageWithCredit from '~/components/global/ImageWithCredit'
import SchemaMarkup from '~/components/global/SchemaMarkup'
import Container from '~/components/layout/Container'
import { schemaMarkupFromChilli } from '~/lib/calculations/schemaMarkup'

interface Props {
  chilli: ICultivar
  relatedChillies: ICultivar[]
}

const FullChilliProfile = (props: Props): JSX.Element => {
  const { image, name, desc } = props.chilli
  const { relatedChillies } = props
  const defaultImage = image
  const alt = defaultImage?.alt ?? 'No image available'

  const src = defaultImage?.handle ? `${defaultImage.handle}.jpg` : '/placeholder-pepper.jpg'

  const structuredData = schemaMarkupFromChilli(props.chilli)
  return (
    <>
      <section>
        <SchemaMarkup data={structuredData} />
        <Container>
          <article className="py-6 max-w-prose">
            <HighlightText className="text-3xl mb-3 bg-blue-700">
              <h2>{name}</h2>
            </HighlightText>{' '}
            <br />
            <div className="my-3 inline-flex border border-gray-300 text-[0px]">
              <ImageWithCredit credit={defaultImage?.attribution} width={600} height={600} alt={alt} src={src} />
            </div>
            <div className="my-3">
              <ChilliDetails {...props.chilli} />
            </div>
            <div className="prose my-3">
              <ReactMarkdown>{desc}</ReactMarkdown>
            </div>
          </article>
        </Container>
      </section>
      {relatedChillies.length > 0 && (
        <section className="py-6 bg-gray-300">
          <Container>
            <h2 className="text-3xl p-3 inline-block font-bold text-white bg-green-800 mb-6">Keep Exploring</h2>
          </Container>
          <ChilliListing chillies={relatedChillies} />
        </section>
      )}
    </>
  )
}
export default FullChilliProfile
