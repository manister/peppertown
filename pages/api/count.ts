import type { NextApiRequest, NextApiResponse } from 'next'
import { getCultivarCount } from '~/lib/actions/db-actions'
import { filterArrayToPrismaWhere } from '~/lib/calculations/filters'

/* simple API route that accepts
a POST req where the body is an array of 
filters and returns the total
number of chillies that the
array of filters would return */

const getCount = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }
  try {
    const body: IFilter[] = JSON.parse(req.body)
    const where = filterArrayToPrismaWhere(body)
    const count = await getCultivarCount({ where })
    res.status(200).json(count)
  } catch (e) {
    console.error(e)
    res.status(500).send({ message: e })
  }
}

export default getCount
