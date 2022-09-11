import React from 'react'
import Emoji from '~/components/global/Emoji'
import LinkTo from '~/components/global/LinkTo'

const ChilliDetails = (props: IChilli): JSX.Element => {
  const { scoville, species, origin } = props

  return (
    <>
      <div className="text-slate-600">
        {scoville && (
          <div className="mb-2">
            <span className="font-bold tracking-wide">
              <Emoji src="🔥" /> Heat:{' '}
            </span>
            <span className="font-bold">
              {scoville[0]} - {scoville[1]} SHU
            </span>
          </div>
        )}
        {species.length > 0 && (
          //Make into component for species list
          <div className="mb-2">
            <span className="font-bold tracking-wide">
              <Emoji src="🍃" /> Species:{' '}
            </span>
            {species.map((item) => (
              <React.Fragment key={item.handle}>
                <LinkTo
                  className={`focus-visible:ring ring-offset-2 ring-blue underline md:no-underline md:hover:underline p-2 text-white font-bold
                    ${item.handle === 'annuum' && 'bg-green'}
                    ${item.handle === 'chinense' && 'bg-red-300'}
                    ${item.handle === 'baccatum' && 'bg-yellow'}
                    ${item.handle === 'frutescens' && 'bg-pink'}
                  inline-block`}
                  href={`/species/${item.handle}`}
                >
                  {item.name}
                </LinkTo>
              </React.Fragment>
            ))}
          </div>
        )}

        {origin.length > 0 && (
          //Make into component for species list
          <div>
            <span className="font-bold tracking-wide mb-1">
              <Emoji src="🌐" /> Origins:{' '}
            </span>
            {origin.map((item) => (
              <React.Fragment key={item.handle}>
                <LinkTo
                  className=" focus-visible:ring ring-offset-2 ring-bluehover:underline p-2 text-white font-bold bg-gray-700 inline-block"
                  href={`/origin/${item.handle}`}
                >
                  {item.name}
                </LinkTo>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default ChilliDetails
