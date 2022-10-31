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

const ChilliDetails = (props: ICultivar): JSX.Element => {
  const { scovilleMax, scovilleMin, species, origin } = props

  return (
    <>
      <div className="text-slate-600">
        {scovilleMin && scovilleMax && (
          <ChilliDetailSection label="Heat:" emoji="🔥">
            <span className="font-bold">
              {scovilleMin} - {scovilleMax} SHU
            </span>
          </ChilliDetailSection>
        )}
        {species && (
          //Make into component for species list
          <ChilliDetailSection label="Species:" emoji="🍃">
            <HighlightText
              href={`species/${species.handle}`}
              className={`
                    ${species.handle === 'annuum' && 'bg-green'}
                    ${species.handle === 'chinense' && 'bg-red-300'}
                    ${species.handle === 'baccatum' && 'bg-yellow'}
                    ${species.handle === 'frutescens' && 'bg-pink'}`}
            >
              {species.name}
            </HighlightText>
          </ChilliDetailSection>
        )}

        {origin && (
          //Make into component for species list
          <ChilliDetailSection emoji="🌐" label="Origins:">
            <React.Fragment key={origin.handle}>
              <HighlightText className="bg-gray-700" href={`origin/${origin.handle}`}>
                {origin.name}
              </HighlightText>
            </React.Fragment>
          </ChilliDetailSection>
        )}
      </div>
    </>
  )
}

export default ChilliDetails
