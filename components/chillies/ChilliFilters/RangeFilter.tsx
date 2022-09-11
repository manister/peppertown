import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import React, { useState } from 'react'
import FilterButton from './FilterButton'

interface Props {
  filter: IFilterRange
  sliderChange: (value: number | number[]) => void
  minChange: (value: number) => void
  maxChange: (value: number) => void
}

const powerScale = 4

const convertMarks = (arr: number[]): Record<number, Record<'label', number>> => {
  return arr.reduce((acca, val) => {
    return {
      ...acca,
      [Math.pow(val, 1 / powerScale)]: { label: val },
    }
  }, {} as Record<number, Record<'label', number>>)
}

const RangeFilter = (props: Props): JSX.Element => {
  const { filter, sliderChange, minChange, maxChange } = props
  const [open, setOpen] = useState(false)
  return (
    <React.Fragment key={filter.name}>
      <FilterButton open={open} onClick={() => setOpen(!open)}>
        {filter.displayName}
      </FilterButton>
      {open ? (
        <>
          <Slider
            range
            allowCross={false}
            min={Math.pow(filter.domain[0], 1 / powerScale)}
            max={Math.pow(filter.domain[1], 1 / powerScale)}
            marks={convertMarks([0, 150, 3000, 15000, 60000, 200000, 500000, 1200000])}
            value={[Math.pow(filter.active[0], 1 / powerScale), Math.pow(filter.active[1], 1 / powerScale)]}
            step={0.1}
            onChange={(val) => {
              const rangeVals = val as [number, number]
              const [min, max] = [Math.floor(Math.pow(rangeVals[0], powerScale)), Math.floor(Math.pow(rangeVals[1], powerScale))]
              sliderChange([min, max])
            }}
          />
          <input type="number" value={filter.active[0]} onChange={(e) => minChange(parseFloat(e.target.value))} />
          <input type="number" value={filter.active[1]} onChange={(e) => maxChange(parseFloat(e.target.value))} />
        </>
      ) : null}
    </React.Fragment>
  )
}
export default RangeFilter
