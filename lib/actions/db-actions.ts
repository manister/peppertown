import { prismaCultivarSelects } from '~/lib/data/db-data'

import { Prisma, PrismaClient } from '@prisma/client'

interface Opts {
  where: Prisma.cultivarWhereInput
  page: number
  paginate: number
  sort: {
    by: string
    dir: 'asc' | 'desc'
  } | null
}

const prisma = new PrismaClient()

export const getSingleCultivar = async (handle: string): Promise<ICultivar> => {
  const cultivar = await prisma.cultivar.findUnique({
    where: {
      handle,
    },
    select: prismaCultivarSelects,
  })
  if (cultivar) {
    return cultivar
  } else {
    throw new Error(`Cannot find cultivar with handle "${handle}"`)
  }
}

export const getRelatedCultivars = async (cultivar: ICultivar, n: number): Promise<ICultivar[]> => {
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
      NOT: {
        OR: [{ handle: cultivar.handle }, { handle: { in: fullMatches.map((item) => item.handle) } }],
      },
      origin: { handle: cultivar.origin?.handle },
    },
  })
  if ([...fullMatches, ...originMatches].length === 4) return [...fullMatches, ...originMatches]

  const speciesMatches = await prisma.cultivar.findMany({
    take: n - fullMatches.length - originMatches.length,
    select: prismaCultivarSelects,
    where: {
      NOT: {
        OR: [
          { handle: cultivar.handle },
          { handle: { in: fullMatches.map((item) => item.handle) } },
          { handle: { in: originMatches.map((item) => item.handle) } },
        ],
      },
      species: { handle: cultivar.species?.handle },
    },
  })

  return [...fullMatches, ...originMatches, ...speciesMatches]
}

export const getCultivarCount = async (opts?: { where: Prisma.cultivarWhereInput }): Promise<number> => {
  const number = await prisma.cultivar.count({
    ...(opts?.where ? { where: opts.where } : {}),
  })
  return number
}

//@TODO generalise this with getAll below
export const getCultivars = async (opts: Opts): Promise<ICultivar[]> => {
  const take = opts.paginate
  const skip = opts?.page ? (opts.page - 1) * take : 0
  const orderBy = opts?.sort
    ? {
        [opts.sort.by]: opts.sort.dir,
      }
    : null
  const cultivars: ICultivar[] = await prisma.cultivar.findMany({
    ...(opts?.where ? { where: opts.where } : {}),
    take,
    skip,
    ...(orderBy ? { orderBy } : {}),
    select: prismaCultivarSelects,
  })
  return cultivars
}

export const getAllCultivars = async (): Promise<ICultivar[]> => {
  return await prisma.cultivar.findMany({
    select: prismaCultivarSelects,
  })
}

export const getAllSpecies = async (): Promise<ISpecies[]> => {
  return await prisma.species.findMany()
}

export const getAllOrigins = async (): Promise<IOrigin[]> => {
  return await prisma.origin.findMany()
}

export const getConfig = async (): Promise<IConfig> => {
  const configs = await prisma.config.findMany()
  return configs.reduce((acc, item) => {
    return {
      ...acc,
      [item.key]: item.value,
    }
  }, {} as IConfig)
}
