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
