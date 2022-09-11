const headers = {
  Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
}

interface IEndPoints {
  cultivars: URL
  origins: URL
  species: URL
  colours: URL
}

const endpoints: IEndPoints | null = process.env.AIRTABLE_ENDPOINT
  ? {
      cultivars: new URL(`${process.env.AIRTABLE_ENDPOINT}/Cultivars`),
      origins: new URL(`${process.env.AIRTABLE_ENDPOINT}/Location`),
      species: new URL(`${process.env.AIRTABLE_ENDPOINT}/Species`),
      colours: new URL(`${process.env.AIRTABLE_ENDPOINT}/Colours`),
    }
  : null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shapeChilliData = (el: any): IChilli => {
  const raw = el.fields
  if (!raw.name || !raw.handle) {
    throw new Error('Chilli must have a name and a handle')
  }
  return {
    name: raw.name,
    handle: raw.handle,
    desc: raw.desc.replace(/\u00a0/g, ' ') ?? '',
    scoville: !isNaN(raw.scoville_min) && !isNaN(raw.scoville_max) ? [raw.scoville_min, raw.scoville_max] : null,
    sowRange: raw.sowmin && raw.sowmax ? [raw.sowmin, raw.sowmax] : null,
    ttm: raw.ttm ?? null,
    colours: ((raw.colours ?? []) as unknown[]).flatMap((_colour, index) => {
      try {
        return {
          name: raw['colours/name'][index],
          handle: raw['colours/handle'][index],
          rgb: ['r', 'g', 'b'].map((char) => raw[`colours/${char}`][index] as number) as [number, number, number],
        }
      } catch (error) {
        console.error('Error parsing colour data from airtable', { error })
        return []
      }
    }),
    species: ((raw.species ?? []) as unknown[]).flatMap((_species, index) => {
      try {
        return {
          name: raw['species/name'][index],
          handle: raw['species/handle'][index],
        }
      } catch (error) {
        console.error('Error parsing species data from airtable', { error })
        return []
      }
    }),
    images: ((raw.image ?? []) as unknown[]).flatMap((_image, index) => {
      try {
        const ext = raw['image/data'][index].filename.split('.')[raw['image/data'][index].filename.split('.').length - 1]
        const cloudinaryPublicId = `${raw['image/handle'][index]}-${raw['image/data'][index].id}`
        const cloudinaryUrl = `${cloudinaryPublicId}.${ext}`
        return {
          alt: raw['image/alt'][index],
          attr: raw['image/attr'][index],
          ...raw['image/data'][index],
          cloudinaryUrl,
        }
      } catch (error) {
        console.error('Error parsing image data from airtable', { error })
        return []
      }
    }),
    origin: ((raw.origin ?? []) as unknown[]).flatMap((_origin, index) => {
      try {
        return {
          name: raw['origin/name'][index],
          handle: raw['origin/handle'][index],
          images: ((raw['origin/image'] ?? []) as unknown[]).flatMap((_image, i) => {
            try {
              const ext = raw['image/data'][index].filename.split('.')[raw['image/data'][index].filename.split('.').length - 1]
              const cloudinaryPublicId = `${raw['image/handle'][index]}-${raw['image/data'][index].id}`
              const cloudinaryUrl = `${cloudinaryPublicId}.${ext}`
              return {
                alt: raw['origin/image/alt'][i],
                attr: raw['origin/image/attribution'][i],
                ...raw['origin/image/data'][i],
                cloudinaryUrl,
              }
            } catch (error) {
              console.error('Error parsing origin image data from airtable', { error })

              return []
            }
          }),
        }
      } catch (error) {
        console.error('Error parsing origin data from airtable', { error })

        return []
      }
    }),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shapeOriginData = (el: any): IOrigin => {
  const raw = el.fields
  if (!raw.name || !raw.handle) {
    throw new Error('Origin must have a name and a handle')
  }

  return {
    name: raw.name,
    handle: raw.handle,
    images: ((raw['image'] ?? []) as unknown[]).flatMap((_image, i) => {
      try {
        const ext = raw['image/data'][i].filename.split('.')[raw['image/data'][i].filename.split('.').length - 1]
        const cloudinaryPublicId = `${raw['image/handle'][i]}-${raw['image/data'][i].id}`
        const cloudinaryUrl = `${cloudinaryPublicId}.${ext}`
        return {
          alt: raw['image/alt'][i],
          attr: raw['image/attribution'][i],
          ...raw['image/data'][i],
          cloudinaryUrl,
        }
      } catch (error) {
        console.error('Error parsing origin image data from airtable', { error })
        return []
      }
    }),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shapeSpeciesData = (el: any): ISpecies => {
  const raw = el.fields
  if (!raw.name || !raw.handle) {
    throw new Error('Species must have a name and a handle')
  }
  return {
    name: raw.name,
    handle: raw.handle,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shapeColourData = (el: any): IColour => {
  const raw = el.fields
  if (!raw.name || !raw.handle) {
    throw new Error('Colour must have a name and a handle')
  }

  return {
    name: raw.name,
    handle: raw.handle,
    rgb: ['r', 'g', 'b'].map((char) => raw[`${char}`] as number) as [number, number, number],
  }
}

interface IGetChilliesOpts {
  filterFormula?: string
  view?: 'All'
  sort?: {
    direction: 'asc' | 'desc'
    field: string
  }
}

export const getChilliesFromAirtable = async (opts: IGetChilliesOpts = { view: 'All' }): Promise<IChilli[]> => {
  const view = opts?.view ?? 'All'

  const sort = opts?.sort ?? {
    direction: 'asc',
    field: 'name',
  }
  if (!endpoints) {
    console.error('Check that the AIRTABLE_ENDPOINT is set in your env.')
    return []
  }

  const endpoint = endpoints['cultivars']

  endpoint.searchParams.set('view', view)

  if (opts?.filterFormula) endpoint.searchParams.set('filterByFormula', opts.filterFormula)

  endpoint.searchParams.set('sort[0][field]', sort.field)
  endpoint.searchParams.set('sort[0][direction]', sort.direction)

  try {
    const res = await fetch(endpoint.toString(), { headers })
    const data = await res.json()
    if (data.records.length < 1) return []
    const chillies = (data.records as unknown[]).flatMap((record) => {
      try {
        return shapeChilliData(record)
      } catch (e) {
        console.error(`Could not shape chilli data`, e)
        return []
      }
    })
    return chillies
  } catch (e) {
    console.error(`Could not fetch ${endpoint.toString()}`, e)
    return []
  }
}

type IDataKeys = 'colours' | 'origins' | 'species'

type IDataType<T> = T extends 'colours' ? IColour : T extends 'origins' ? IOrigin : T extends 'species' ? ISpecies : never

const shaper = <T extends IDataKeys>(dataKey: T, record: unknown): IDataType<T> => {
  switch (dataKey as IDataKeys) {
    case 'colours':
      return shapeColourData(record) as IDataType<T>
    case 'origins':
      return shapeOriginData(record) as IDataType<T>
    case 'species':
      return shapeSpeciesData(record) as IDataType<T>
  }
}

export const getBasicDataFromAirtable = async <T extends IDataKeys>(key: T): Promise<IDataType<T>[]> => {
  if (!endpoints) {
    console.error('Check that the AIRTABLE_ENDPOINT is set in your env.')
    return []
  }
  const endpoint = endpoints[key]

  try {
    const res = await fetch(endpoint.toString(), { headers })
    const data = await res.json()
    if (data.records.length < 1) return []
    const items = (data.records as unknown[]).flatMap((record) => {
      try {
        const item = shaper(key, record)
        return [item]
      } catch (e) {
        console.error(`Could not shape ${key} data`, e)
        return []
      }
    })
    return items
  } catch (e) {
    console.error(`Could not fetch ${endpoint.toString()}`, e)
    return []
  }
}
