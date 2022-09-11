import type { NextApiRequest, NextApiResponse } from 'next'
import { getChilliesFromAirtable } from '~/lib/airtable'
import { filterArrayToAirtableFilter } from '~/lib/filters'

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
    const body = JSON.parse(req.body) as IFilter[]
    const filterFormula = filterArrayToAirtableFilter(body)
    const chillies = await getChilliesFromAirtable({ filterFormula })
    res.status(200).json(chillies.length)
  } catch (e) {
    console.error(e)
  }
}

export default getCount
