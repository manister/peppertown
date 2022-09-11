import React from 'react'
import ImageWithCredit from '~/components/global/ImageWithCredit'
import LinkTo from '~/components/global/LinkTo'
import ChilliDetails from './ChilliDetails'

// import { useGlobalState } from '~/state/context'

const ChilliCard = (props: IChilli): JSX.Element => {
  const { images, name, handle } = props
  const defaultImage = images[0]
  const alt = defaultImage?.alt ?? 'No image available'

  // const { state, actions } = useGlobalState()
  // const { wishlist } = state

  const src = defaultImage?.cloudinaryUrl ? defaultImage.cloudinaryUrl : '/placeholder-pepper.jpg'

  return (
    <div className="w-1/1 h-1/1  overflow-hidden flex flex-col border-b-4 border-b-black border-x border-x-slate-300 border-t border-t-slate-300 bg-white">
      <div className="bg-gray-900">
        <ImageWithCredit
          href={`/cultivars/${handle}`}
          credit={defaultImage?.attr}
          className="block focus-visible:outline hover:outline outline-[3px]"
          width={600}
          height={400}
          alt={alt}
          src={src}
        />
      </div>

      <div className="p-4 mb-4">
        <LinkTo
          className="focus-visible:ring ring-offset-2  ring-blue inline-block mb-4 text-white p-2 bg-blue-700"
          href={`/cultivars/${handle}`}
        >
          <h2 className="text-xl font-bold tracking-wide underline md:no-underline md:hover:underline">{name}</h2>
        </LinkTo>

        {/* {wishlist.has(handle) ? (
          <button onClick={() => actions.removeFromWishlist(handle)}>remove</button>
        ) : (
          <button onClick={() => actions.addToWishlist(handle)}>add</button>
        )} */}

        <ChilliDetails {...props} />
      </div>
    </div>
  )
}
export default ChilliCard
