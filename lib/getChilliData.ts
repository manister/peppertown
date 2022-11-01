import { PrismaClient } from '@prisma/client'
import { filterArrayToPrismaWhere } from '~/lib/filters'

interface Opts {
  filters: IFilter[]
}

const getChilliData = async (opts?: Opts): Promise<ICultivar[]> => {
  const where = opts?.filters ? filterArrayToPrismaWhere(opts.filters) : null

  const prisma = new PrismaClient()
  const cultivars: ICultivar[] = await prisma.cultivar.findMany({
    ...(where ? { where } : {}),
    select: {
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
    },
  })
  return cultivars
}

export default getChilliData
