import { getRelatedCultivars, getSingleCultivar } from '~/lib/actions/db-actions'

export const buildCultivarPageData = async (paths: string[]): Promise<ICultivarPageData> => {
  const handle = paths[1] as string
  const cultivar = await getSingleCultivar(handle)

  //try and get at least 4 related cultivars
  const relatedCultivars = await getRelatedCultivars(cultivar, 4)
  return { cultivar, relatedCultivars }
}
