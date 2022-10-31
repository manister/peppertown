import type { NextApiRequest, NextApiResponse } from 'next'
import getChilliData from '~/lib/getChilliData'

const getCultivars = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const cultivars = await getChilliData()
  res.status(200).send({ cultivars })
}

export default getCultivars
