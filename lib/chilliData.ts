import { PrismaClient } from '@prisma/client'
import { filterArrayToPrismaWhere } from '~/lib/filters'

interface Opts {
  filters?: IFilter[]
  page?: number
  paginate?: number
  sort?: {
    by: string
    dir: 'asc' | 'desc'
  }
}

const prismaCultivarSelects = {
  handle: true,
  name: true,
  desc: true,
  scovilleMax: true,
  scovilleMin: true,
  ttm: true,
  //relations:
  species: {
    select: {
      handle: true,
      name: true,
    },
  },
  colour: {
    select: {
      handle: true,
      name: true,
      r: true,
      g: true,
      b: true,
    },
  },
  origin: {
    select: {
      handle: true,
      name: true,
    },
  },
  image: {
    select: {
      name: true,
      alt: true,
      attribution: true,
      handle: true,
    },
  },
}

const prisma = new PrismaClient()

export const getSingleChilli = async (handle: string): Promise<ICultivar> => {
  const chilli = await prisma.cultivar.findUnique({
    where: {
      handle,
    },
    select: prismaCultivarSelects,
  })
  if (chilli) {
    return chilli
  } else {
    throw new Error(`Cannot find chilli with handle "${handle}"`)
  }
}

export const getRelatedChillies = async (cultivar: ICultivar, n: number): Promise<ICultivar[]> => {
  const fullMatches = await prisma.cultivar.findMany({
    take: n,
    select: prismaCultivarSelects,
    where: {
      NOT: { handle: cultivar.handle },
      AND: [{ species: { handle: cultivar.species?.handle } }, { origin: { handle: cultivar.origin?.handle } }],
    },
  })
  if (fullMatches.length === 4) return fullMatches

  const originMatches = await prisma.cultivar.findMany({
    take: n - fullMatches.length,
    select: prismaCultivarSelects,
    where: {
      NOT: { handle: cultivar.handle },
      origin: { handle: cultivar.origin?.handle },
    },
  })
  if ([...fullMatches, ...originMatches].length === 4) return [...fullMatches, ...originMatches]

  const speciesMatches = await prisma.cultivar.findMany({
    take: n - fullMatches.length - originMatches.length,
    select: prismaCultivarSelects,
    where: {
      NOT: { handle: cultivar.handle },
      species: { handle: cultivar.species?.handle },
    },
  })

  return [...fullMatches, ...originMatches, ...speciesMatches]
}

export const getChilliData = async (opts?: Opts): Promise<ICultivar[]> => {
  const where = opts?.filters ? filterArrayToPrismaWhere(opts.filters) : null
  const take = opts?.paginate ?? 12
  const skip = opts?.page ? (opts.page - 1) * take : 0
  const orderBy = opts?.sort
    ? {
        [opts.sort.by]: opts.sort.dir,
      }
    : null
  const cultivars: ICultivar[] = await prisma.cultivar.findMany({
    ...(where ? { where } : {}),
    take,
    skip,
    ...(orderBy ? { orderBy } : {}),
    select: prismaCultivarSelects,
  })
  return cultivars
}

export const getChilliCount = async (opts?: Opts): Promise<number> => {
  const where = opts?.filters ? filterArrayToPrismaWhere(opts.filters) : null
  const number = await prisma.cultivar.count({
    ...(where ? { where } : {}),
  })
  return number
}
