export const chunk = <T>(arr: T[]): [T, T][] => {
  if (arr.length % 2) {
    console.error('Array length is not disvible by 2, chunk failed')
    return []
  }
  return arr.flatMap((_, i, a) => {
    const pair = a.slice(i, i + 2) as [T, T]
    return i % 2 ? [] : [pair]
  })
}

export const arrShallowEq = <T>(arr1: T[], arr2: T[]): boolean => {
  return arr1.every((item, i) => item === arr2[i])
}

export const shuffle = <T>(array: T[]): T[] => array.sort(() => Math.random() - 0.5)

export enum EnumAllowedSorts {
  asc = 'asc',
  desc = 'desc',
}

export const pathToPathsAndSortAndPage = (
  paths: string[],
  sortKeys: IConfig['sortKeys']
): { paths: string[]; sort: TSort; page: number } => {
  const last = paths[paths.length - 1]
  const secondLast = paths[paths.length - 2]
  const pageNo = last ? parseInt(last) : NaN
  const hasPage = last && !isNaN(pageNo)
  const sortPath = hasPage ? secondLast : last
  const hasSort = sortPath && sortPath.includes('sort:')
  let page = 1
  let sort: TSort = null

  if (hasPage) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    page = pageNo
  }
  if (hasSort) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_s, by, dir] = sortPath.split(':')

    if (by) {
      const sortKey = sortKeys.find((item) => item.urlKey === by)
      if (sortKey) {
        if (dir && dir in EnumAllowedSorts) {
          sort = { by: sortKey.objectKey, dir: <EnumAllowedSorts>dir }
        } else {
          sort = { by: sortKey.objectKey, dir: 'asc' }
        }
      }
    }
  }

  const sliceAmount = hasPage && hasSort ? 2 : hasPage || hasSort ? 1 : 0
  return { paths: sliceAmount > 0 ? paths.slice(0, -sliceAmount) : paths, sort, page }
}
