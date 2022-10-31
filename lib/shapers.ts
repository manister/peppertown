import { colours, cultivars, location, species, image_library } from '@prisma/client'

export const shapeColourData = (coloursData: colours): IColour => {
  return {
    rgb: [coloursData.r, coloursData.g, coloursData.b],
    name: coloursData.name ?? '',
    handle: coloursData.handle ?? '',
  }
}

export const shapeSpeciesData = (speciesData: species): ISpecies => {
  return {
    handle: speciesData.handle,
    name: speciesData.name,
  }
}

export const shapeImageData = (imageData: image_library): IImage => {
  return {
    alt: imageData.alt ?? '',
    attr: imageData.attribution ?? '',
    id: imageData.id,
    url: imageData.srcRaw ?? '',
  }
}

export const shapeOriginData = (originData: location): IOrigin => {
  return {
    handle: originData.handle,
    name: originData.name,
  }
}

export const shapeChilliData = (
  cultivarData: cultivars,
  speciesData?: species,
  coloursData?: colours,
  originData?: location,
  imageData?: image_library
): IChilli => {
  return {
    name: cultivarData.name,
    handle: cultivarData.handle,
    desc: cultivarData.desc,
    scoville: [cultivarData.scovilleMin ?? 0, cultivarData.scovilleMax ?? 0],
    sowRange: [cultivarData.sowmin ?? new Date('1/1/22'), cultivarData.sowmax ?? new Date('1/05/22')],
    ttm: cultivarData.ttm,
    colours: coloursData ? shapeColourData(coloursData) : undefined,
    species: speciesData ? shapeSpeciesData(speciesData) : undefined,
    images: imageData ? shapeImageData(imageData) : undefined,
    origin: originData ? shapeOriginData(originData) : undefined,
  }
}
