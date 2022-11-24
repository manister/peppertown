import { BreadcrumbList, ItemList, Taxon, WithContext } from 'schema-dts'

export const schemaMarkupFromCultivar = (cultivar: ICultivar): WithContext<Taxon> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Taxon',
    taxonRank: 'Cultivar',
    name: cultivar.name,
    parentTaxon: {
      '@type': 'Taxon',
      taxonRank: 'Species',
      name: `Capsicum ${cultivar.species?.name}`,
      sameAs: [`https://species.wikimedia.org/wiki/Capsicum_${cultivar.species?.handle}`],
      parentTaxon: {
        '@type': 'Taxon',
        taxonRank: 'Genus',
        sameAs: ['https://species.wikimedia.org/wiki/Capsicum', 'https://www.wikidata.org/wiki/Q165199'],
        name: 'Capsicum',
        alternateName: ['Chilli', 'Chili', 'Chilli Pepper', 'Chili Pepper', 'Hot Pepper'],
      },
    },
  }
}

export const schemaMarkupFromListOfCultivars = (cultivars: ICultivar[], path: string): WithContext<ItemList> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: `https://pepper.town${path}`,
    numberOfItems: cultivars.length,
    name: 'List of chilli peppers',
    alternateName: ['List of chili peppers', 'List of hot peppers', 'List of cultivars'],
    itemListElement: cultivars.map((cultivar) => {
      return schemaMarkupFromCultivar(cultivar)
    }),
  }
}

export const schemaMarkupBreadcrumbsFromLinks = (links: { link: string; title: string }[]): WithContext<BreadcrumbList> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: links.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      item: `https://pepper.town${item.link}`,
    })),
  }
}
