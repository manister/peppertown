import React from 'react'
import Emoji from '~/components/global/Emoji'
import HighlightText from '~/components/global/HighlightText'

interface ChilliDetailSectionProps {
  emoji: string
  label: string
  children: React.ReactNode
}

const ChilliDetailSection = (props: ChilliDetailSectionProps): JSX.Element => {
  const { emoji, children, label } = props
  return (
    <>
      <div className="mb-2">
        <span className="font-bold tracking-wide">
          <Emoji src={emoji} /> {label}{' '}
        </span>
        <>{children}</>
      </div>
    </>
  )
}

const ChilliDetails = (props: IChilli): JSX.Element => {
  const { scoville, species, origin } = props

  return (
    <>
      <div className="text-slate-600">
        {scoville && (
          <ChilliDetailSection label="Heat:" emoji="🔥">
            <span className="font-bold">
              {scoville[0]} - {scoville[1]} SHU
            </span>
          </ChilliDetailSection>
        )}
        {species.length > 0 && (
          //Make into component for species list
          <ChilliDetailSection label="Species:" emoji="🍃">
            {species.map((item) => (
              <React.Fragment key={item.handle}>
                <HighlightText
                  href={`species/${item.handle}`}
                  className={`
                    ${item.handle === 'annuum' && 'bg-green'}
                    ${item.handle === 'chinense' && 'bg-red-300'}
                    ${item.handle === 'baccatum' && 'bg-yellow'}
                    ${item.handle === 'frutescens' && 'bg-pink'}`}
                >
                  {item.name}
                </HighlightText>
              </React.Fragment>
            ))}
          </ChilliDetailSection>
        )}

        {origin.length > 0 && (
          //Make into component for species list
          <ChilliDetailSection emoji="🌐" label="Origins:">
            {origin.map((item) => (
              <React.Fragment key={item.handle}>
                <HighlightText className="bg-gray-700" href={`origin/${item.handle}`}>
                  {item.name}
                </HighlightText>
              </React.Fragment>
            ))}
          </ChilliDetailSection>
        )}
      </div>
    </>
  )
}

export default ChilliDetails
