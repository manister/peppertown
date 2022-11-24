export const importAll = (r: __WebpackModuleApi.RequireContext): Record<string, unknown> =>
  r.keys().reduce((acc, path) => {
    const last = path.split('/')[path.split('/').length - 1]
    const fileName = last?.split('.')[0]
    return {
      ...acc,
      ...(fileName
        ? {
            [fileName]: r(path),
          }
        : {}),
    }
  }, {})
