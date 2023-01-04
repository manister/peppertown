import React from 'react'
import Emoji from '~/components/global/Emoji'
import HighlightText from '~/components/global/HighlightText'

interface CultivarDetailSectionProps {
  emoji: string
  label: string
  children: React.ReactNode
}

const CultivarDetailSection = (props: CultivarDetailSectionProps): JSX.Element => {
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

const CultivarDetails = (props: ICultivar): JSX.Element => {
  const { scovilleMax, scovilleMin, species, origin } = props

  return (
    <>
      <div className="text-slate-600">
        <CultivarDetailSection label="Heat:" emoji="🔥">
          <span className="font-bold">
            {scovilleMin.toLocaleString()} - {scovilleMax.toLocaleString()} SHU
          </span>
        </CultivarDetailSection>

        {species && (
          //Make into component for species list
          <CultivarDetailSection label="Species:" emoji="🍃">
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
          </CultivarDetailSection>
        )}

        {origin && (
          //Make into component for species list
          <CultivarDetailSection emoji="🌐" label="Origins:">
            <React.Fragment key={origin.handle}>
              <HighlightText className="bg-gray-700" href={`origin/${origin.handle}`}>
                {origin.name}
              </HighlightText>
            </React.Fragment>
          </CultivarDetailSection>
        )}
      </div>
    </>
  )
}

export default CultivarDetails
