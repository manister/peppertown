import { PrismaClient } from '@prisma/client'
import { filterArrayToPrismaWhere } from '~/lib/filters'
// import { shapeChilliData } from '~/lib/shapers'

interface Opts {
  filters: IFilter[]
}

const getChilliData = async (opts: Opts): Promise<ICultivar[]> => {
  const { filters } = opts
  const where = filterArrayToPrismaWhere(filters)
  const prisma = new PrismaClient()
  const cultivars: ICultivar[] = await prisma.cultivar.findMany({
    where,
    select: {
      handle: true,
      name: true,
      desc: true,
      scovilleMax: true,
      scovilleMin: true,
      ttm: true,
      sowmin: true,
      sowmax: true,
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
          src: true,
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
