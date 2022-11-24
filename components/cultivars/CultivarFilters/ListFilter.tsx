import React, { useState } from 'react'
import FilterButton from './FilterButton'

interface Props {
  filter: IFilterList
  onChange: (indexChanged: number, value: boolean) => void
}

const ListFilter = (props: Props): JSX.Element => {
  const { filter, onChange } = props
  const [open, setOpen] = useState(false)

  return (
    <>
      <FilterButton open={open} onClick={() => setOpen(!open)}>
        {filter.displayName}
      </FilterButton>
      {open ? (
        <ul className="px-3 mb-3">
          {filter.values.map((option, optionIndex) => {
            return (
              <li key={option.value} className="mb-2 text-lg">
                <input
                  className="mr-1"
                  onChange={(e) => onChange(optionIndex, e.target.checked)}
                  type={'checkbox'}
                  checked={option.active}
                  id={option.value}
                />
                <label className="select-none" htmlFor={option.value}>
                  {option.displayValue}
                </label>
              </li>
            )
          })}
        </ul>
      ) : null}
    </>
  )
}
export default ListFilter
