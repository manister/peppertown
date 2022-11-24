import { BreadcrumbList, ItemList, Taxon, WithContext } from 'schema-dts'

export const schemaMarkupFromChilli = (chilli: ICultivar): WithContext<Taxon> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Taxon',
    taxonRank: 'Cultivar',
    name: chilli.name,
    parentTaxon: {
      '@type': 'Taxon',
      taxonRank: 'Species',
      name: `Capsicum ${chilli.species?.name}`,
      sameAs: [`https://species.wikimedia.org/wiki/Capsicum_${chilli.species?.handle}`],
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

export const schemaMarkupFromListOfChillies = (chillies: ICultivar[], path: string): WithContext<ItemList> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: `https://pepper.town${path}`,
    numberOfItems: chillies.length,
    name: 'List of chilli peppers',
    alternateName: ['List of chili peppers', 'List of hot peppers', 'List of chillies'],
    itemListElement: chillies.map((chilli) => {
      return schemaMarkupFromChilli(chilli)
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
