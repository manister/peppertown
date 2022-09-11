import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import { filterArrayToPathArray, updateListFilter } from '~/lib/filters'
import { useDebounce } from 'use-debounce'
import ListFilter from './ChilliFilters/ListFilter'
// import RangeFilter from './ChilliFilters/RangeFilter'
import Button from '../global/Button'

type Props = {
  open: boolean
  filters: IFilter[]
  setOpen: (value: boolean) => void
}

const ChilliFilters = (props: Props): JSX.Element => {
  const { filters, open, setOpen } = props
  const router = useRouter()

  const [currentFilters, setCurrentFilters] = useState(filters)

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keyup', onKeyUp)
    return () => window.removeEventListener('keyup', onKeyUp)
  }, [setOpen])

  const [debouncedFilters] = useDebounce(currentFilters, 300, { leading: true, maxWait: 1500 })

  const [count, setCount] = useState(null as null | number)

  useEffect(() => {
    setCurrentFilters(filters)
  }, [filters])

  useEffect(() => {
    fetch('/api/count', {
      method: 'POST',
      body: JSON.stringify(debouncedFilters),
    }).then((res) => {
      res.json().then((body) => {
        setCount(body as number)
      })
    })
  }, [debouncedFilters])

  return (
    <>
      <aside
        className={`h-full overflow-auto w-1/1 md:max-w-[400px] h-100 fixed left-0 top-0 bottom-0 z-50 bg-white transition-transform ${
          open ? '' : 'translate-x-[-100%]'
        }`}
      >
        <header className="p-4 flex justify-between border-b-2 bg-gray-700 ">
          <h3 className="underline md:no-underline text-xl font-bold uppercase tracking-wider text-white">Filters</h3>
          <button disabled={!open} type="button" onClick={() => setOpen(false)} aria-label="close" className="text-xl text-white">
            ✖
          </button>
        </header>
        <form
          className={`h-1/1 flex flex-col`}
          onSubmit={(e) => {
            e.preventDefault()
            const filterPath = filterArrayToPathArray(currentFilters).flat().join('/')

            router.push(filterPath ? filterPath : '/cutlivars')
          }}
        >
          <fieldset disabled={!open}>
            <ul>
              {currentFilters.map((filter, index) => {
                if (filter.type === 'list') {
                  return (
                    <li key={filter.name} className="border-b-2 border-slate-200">
                      <ListFilter
                        filter={filter}
                        onChange={(optionIndex, value) => {
                          const newFilters = updateListFilter(currentFilters, index, optionIndex, value)
                          setCurrentFilters(newFilters)
                        }}
                      />
                    </li>
                  )
                }
                if (filter.type === 'range') {
                  return null
                  //TODO: range filter final work
                  // return (
                  //   <li key={filter.name} className="border-b-2 border-slate-200">
                  //     <RangeFilter
                  //       key={filter.name}
                  //       filter={filter}
                  //       sliderChange={(val) => {
                  //         const newFilters = updateRangeFilter(currentFilters, index, val as [number, number])
                  //         setCurrentFilters(newFilters)
                  //       }}
                  //       minChange={(val) => {
                  //         const newFilters = updateRangeFilter(currentFilters, index, [val, null])
                  //         setCurrentFilters(newFilters)
                  //       }}
                  //       maxChange={(val) => {
                  //         const newFilters = updateRangeFilter(currentFilters, index, [null, val])
                  //         setCurrentFilters(newFilters)
                  //       }}
                  //     />
                  //   </li>
                  // )
                }
                return null
              })}
            </ul>
          </fieldset>
          <div className="sticky bottom-0 w-1/1  bg-white p-3 mt-auto">
            <Button variant="primary">
              <button disabled={!open || count === 0} onClick={() => setOpen(false)} className="w-1/1" type="submit">
                Apply {count !== null ? `(${count})` : ''}
              </button>
            </Button>
          </div>
        </form>
      </aside>
      {open ? (
        <button
          disabled={!open}
          onClick={() => setOpen(false)}
          className="fixed top-0 right-0 bottom-0 left-0 block bg-black opacity-20 z-10 cursor-auto"
        ></button>
      ) : null}
    </>
  )
}

export default ChilliFilters
