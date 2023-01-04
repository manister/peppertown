import path from 'path'

export enum EnumAllowedSorts {
  asc = 'asc',
  desc = 'desc',
}

export const getFilterPathFromPaths = (paths: string[]): string[] => {
  const last = paths[paths.length - 1]
  const secondLast = paths[paths.length - 2]
  const pageNo = last ? parseInt(last) : NaN
  const hasPage = last && !isNaN(pageNo)
  const sortPath = hasPage ? secondLast : last
  const hasSort = sortPath && sortPath.includes('sort:')
  const sliceAmount = hasPage && hasSort ? 2 : hasPage || hasSort ? 1 : 0
  return sliceAmount > 0 ? paths.slice(0, -sliceAmount) : paths
}

export const getPageFromPaths = (paths: string[]): number => {
  const last = paths[paths.length - 1]
  const pageNo = last ? parseInt(last) : 1
  return isNaN(pageNo) ? 1 : pageNo
}

export const getSortFromPaths = (paths: string[], sortKeys: ISortKeyValue[]): TSort => {
  const last = paths[paths.length - 1]
  const secondLast = paths[paths.length - 2]
  const pageNo = last ? parseInt(last) : NaN
  const hasPage = last && !isNaN(pageNo)
  const sortPath = hasPage ? secondLast : last
  const hasSort = sortPath && sortPath.includes('sort:')
  if (hasSort) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_s, by, dir] = sortPath.split(':')

    if (by) {
      const sortKey = sortKeys.find((item) => item.urlKey === by)
      if (sortKey) {
        if (dir && dir in EnumAllowedSorts) {
          return { by: sortKey.objectKey, dir: <EnumAllowedSorts>dir }
        } else {
          return { by: sortKey.objectKey, dir: 'asc' }
        }
      }
    }
  }
  return { dir: 'asc', by: sortKeys[0]?.objectKey ?? 'name' }
}

export const determineRequestType = (paths: string[]): 'listing' | 'cultivar' => {
  if (paths.length < 1) throw Error('paths cannot be empty')
  const lastPart = paths[paths.length - 1] as string //as last item must exist if above error not thrown
  if (paths.length > 2 || (paths.length === 1 && paths[0] === 'cultivars')) {
    return 'listing'
  }
  const isPageNo = !isNaN(lastPart ? parseInt(lastPart) : NaN) // check is handle is a number
  const isSort = lastPart.includes('sort:') // check if handle is a sort
  if (paths[0] === 'cultivars' && !isSort && !isPageNo) {
    //this is a handle page
    return 'cultivar'
  }
  return 'listing'
}
