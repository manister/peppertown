import React, { PropsWithChildren } from 'react'
import Emoji from '~/components/global/Emoji'

interface Props extends PropsWithChildren {
  onClick: () => void
  open: boolean
}

const FilterButton = (props: Props): JSX.Element => {
  const { onClick, open, children } = props
  return (
    <>
      <button className="text-left flex items-center justify-between w-1/1 px-3 py-4 text-xl" onClick={() => onClick()} type="button">
        <>{children}</>
        <Emoji src={`${open ? '🔼' : '🔽'}`} />
      </button>
    </>
  )
}
export default FilterButton
