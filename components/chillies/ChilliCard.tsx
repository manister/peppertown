import React from 'react'
import HighlightText from '~/components/global/HighlightText'
import ImageWithCredit from '~/components/global/ImageWithCredit'
import ChilliDetails from './ChilliDetails'

// import { useGlobalState } from '~/state/context'

const ChilliCard = (props: ICultivar): JSX.Element => {
  const { image, name, handle } = props
  const defaultImage = image
  const alt = defaultImage?.alt ?? 'No image available'

  const src = defaultImage?.src ? defaultImage.src : '/placeholder-pepper.jpg'

  return (
    <div className="w-1/1 h-1/1  overflow-hidden flex flex-col border-b-4 border-b-black border-x border-x-slate-300 border-t border-t-slate-300 bg-white">
      <div className="bg-gray-900">
        <ImageWithCredit
          href={`/cultivars/${handle}`}
          credit={defaultImage?.attribution}
          className="block focus-visible:outline hover:outline outline-[3px]"
          width={600}
          height={500}
          alt={alt}
          src={src}
        />
      </div>

      <div className="p-4 mb-4">
        <HighlightText className="text-lg mb-3 bg-blue-700" href={`/cultivars/${handle}`}>
          <h2>{name}</h2>
        </HighlightText>

        <ChilliDetails {...props} />
      </div>
    </div>
  )
}
export default ChilliCard
