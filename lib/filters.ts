import { Prisma, PrismaClient } from '@prisma/client'

import { arrShallowEq } from './dataHelpers'

const dataToTextFilter = (data: IOrigin[] | ISpecies[] | IColour[]): IFilterSchemaTextValue[] => {
  return data.map((val) => ({
    value: val.handle,
    displayValue: val.name,
    displayType: 'text',
  }))
}

export const getFilterSchema = async (): Promise<IFilterSchema[]> => {
  const prisma = new PrismaClient()
  const species = await prisma.species.findMany()
  const origins = await prisma.origin.findMany()
  // const colours = await getBasicDataFromAirtable('colours')

  const filterSchema = [
    {
      type: 'list',
      name: 'species',
      displayName: 'Species',
      displayType: 'text',
      values: dataToTextFilter(species),
    },
    {
      type: 'list',
      name: 'origin',
      displayName: 'Origin',
      displayType: 'text',
      values: dataToTextFilter(origins),
    },
    // {
    //   type: 'list',
    //   name: 'colour',
    //   displayName: 'Colours',
    //   displayType: 'text',
    //   values: airtableDataToTextFilter(colours),
    // },
    {
      type: 'doublerange',
      name: 'scoville',
      nameMax: 'scovilleMax',
      nameMin: 'scovilleMin',
      displayName: 'Scoville',
      domain: [0, 2200000],
    },
  ] as IFilterSchema[]
  return filterSchema
}

/*

  3 ways of expressing filters:

  A) As an array of filter objects: IFilter[]

  B) A path array:
  made up of couplets
  for checkbox/radio types: ["filterName.name", "filterValue.value+filterValue.value"]
  or for range types: ["filterName.name", "min:max"]

  C) A primsa cultivarWhereInput eg
  {
    "AND": [
      {
        "scovilleMax": {
          "gte": 0
        },
        "scovilleMin": {
          "lte": 2200000
        }
      }
    ]
  }

  We need to convert between A and B, in both directions
  We need to be able to convert A/B into C

  Therefore, keeping A as our primary expresssion of the filters, 3 functions are needed
  B <----> A -----> C

  filterArrayToPathArray
  pathArrayToFilterArray
  filterArrayToAirtableFilter

*/

export const filterArrayToPathArray = (filterArray: IFilter[]): [string, string][] => {
  return filterArray.flatMap((filter) => {
    const handle = filter.name
    const valueString =
      filter.type === 'range' || filter.type === 'doublerange'
        ? arrShallowEq(filter.active, filter.domain)
          ? ''
          : filter.active.join(':')
        : filter.values.flatMap((value) => (value.active ? value.value : [])).join('+')
    if (valueString.length < 1) return []
    return [[handle, valueString]]
  })
}

export const pathArrayToFilterArray = (pathArray: [string, string][], filterSchema: IFilterSchema[]): IFilter[] | null => {
  if (pathArray.length) {
    const matches = pathArray.every((item) => {
      //does every item
      const group = filterSchema.find(({ name }) => name === item[0])
      if (!group) return false
      if (group.type === 'range' || group.type === 'doublerange') return true

      const valueMatches = group.values.some((value) => {
        const values = item[1].split('+')

        return values.includes(value.value)
      })
      return valueMatches
    })

    if (!matches) return null
  }

  const filters = filterSchema.map((filter) => {
    const match = pathArray.find((item) => item[0] === filter.name)

    if (filter.type === 'range' || filter.type === 'doublerange') {
      let active = filter.domain
      if (match) {
        const valueString = match[1]
        const newRange = valueString.split(':').map(parseFloat)
        if (newRange.length === 2) {
          active = newRange as [number, number]
        }
      }
      return {
        ...filter,
        active,
        selected: active,
      }
    } else {
      const valueStrings = match && match.length === 2 ? match[1].split('+') : []
      const values = match
        ? filter.values.map((value) => {
            const active = valueStrings.includes(value.value)
            return {
              ...value,
              active,
            }
          })
        : filter.values

      return {
        ...filter,
        values,
      } as IFilterList
    }
  })

  return filters
}

export const updateRangeFilter = (filters: IFilter[], filterIndex: number, val: [number | null, number | null]): IFilter[] => {
  const newFilters = [...filters]
  const filter = newFilters[filterIndex]
  if (!filter) {
    console.error(`No filter at index ${filterIndex}`)
    return newFilters
  }
  if (filter.type !== 'range') {
    console.error(`Filter ${filter.name}, at index ${filterIndex} is not a range filter`)
    return newFilters
  }
  const newVal = [...filter.active] as [number, number]
  if (val[0] !== null) {
    newVal[0] = val[0]
  }
  if (val[1] !== null) {
    newVal[1] = val[1]
  }
  filter.active = newVal
  return newFilters
}

export const updateListFilter = (filters: IFilter[], filterIndex: number, optionIndex: number, value: boolean): IFilter[] => {
  const newFilters = [...filters]
  const filter = newFilters[filterIndex]
  if (!filter) {
    console.error(`No filter at index ${filterIndex}`)
    return newFilters
  }
  if (filter.type !== 'list') {
    console.error(`Filter ${filter.name}, at index ${filterIndex} is not a list filter`)
    return newFilters
  }
  const option = filter.values[optionIndex]
  if (option) {
    option.active = value
  }
  return newFilters
}

export const filterArrayToPrismaWhere = (filterArray: IFilter[]): Prisma.cultivarWhereInput => {
  const ret: Prisma.cultivarWhereInput = {}
  ret.AND = []

  for (const filter of filterArray) {
    if (filter.type === 'range') {
      const [min, max] = filter.active
      if ((min && isNaN(min)) || (max && isNaN(max))) {
        throw new Error('Range for range values filter must be 2 numbers, seperated by a colon.')
      }
      ret.AND.push({
        AND: [
          {
            [filter.name]: {
              gte: min,
            },
            [filter.name]: {
              lte: max,
            },
          },
        ],
      })
    } else if (filter.type === 'doublerange') {
      const [min, max] = filter.active
      if ((min && isNaN(min)) || (max && isNaN(max))) {
        throw new Error('Range for range values filter must be 2 numbers, seperated by a colon.')
      }
      ret.AND.push({
        AND: [
          {
            [filter.nameMax]: {
              gte: min,
            },
            [filter.nameMin]: {
              lte: max,
            },
          },
        ],
      })
    } else if (filter.type === 'list') {
      const activeValues = (filter.values as IFilterValue[]).filter((value) => value.active)
      if (activeValues.length > 1) {
        ret.AND.push({
          OR: activeValues
            .map((filterValue) => {
              if (filterValue.active) {
                return {
                  [filter.name]: {
                    handle: {
                      equals: filterValue.value,
                    },
                  },
                }
              }
              return []
            })
            .flat(),
        })
      }
    }
  }
  console.log({ ret })
  return ret
}
