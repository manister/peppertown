export const prismaCultivarSelects = {
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
}
