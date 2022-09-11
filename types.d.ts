interface IChilli {
  name: string
  handle: string
  desc: string
  scoville: [number, number] | null
  sowRange: [string, string] | null
  ttm: number
  colours: IColour[]
  species: ISpecies[]
  images: IImage[]
  origin: IOrigin[]
}

interface IColour {
  name: string
  handle: string
  rgb: [number, number, number]
}

interface ISpecies {
  name: string
  handle: string
}

interface IImage {
  cloudinaryUrl: string
  alt: string
  attr: string
  id: string
  width: number
  height: number
  url: string
  filename: string
  size: number
  type: string
}

interface IOrigin {
  name: string
  handle: string
  images: IImage[]
}

interface IState {
  wishlist: Set<string>
}
interface IFilterBaseValue {
  value: string
  displayValue: string
}

interface IFilterSchemaColourValue extends IFilterBaseValue {
  displayType: 'colour'
  rgb: [number, number, number]
}

interface IFilterSchemaTextValue extends IFilterBaseValue {
  displayType: 'text'
}

type IFilterSchemaValue = IFilterSchemaColourValue | IFilterSchemaTextValue

interface IFilterColourValue extends IFilterColourSchemaValue {
  active: boolean
}

interface IFilterTextValue extends IFilterTextSchemaValue {
  active: boolean
}

interface IFilterBaseList {
  type: 'list'
  name: string
  displayName: string
}

interface IFilterSchemaColourList extends IFilterBaseList {
  displayType: 'colour'
  values: IFilterSchemaColourValue[]
}

interface IFilterColourList extends IFilterSchemaColourList {
  values: IFilterValue[]
}

interface IFilterSchemaTextList extends IFilterBaseList {
  displayType: 'text'
  values: IFilterSchemaTextValue[]
}

interface IFilterTextList extends IFilterSchemaTextList {
  values: IFilterTextValue[]
}

type IFilterSchemaList = IFilterSchemaColourList | IFilterSchemaTextList

type IFilterList = IFilterColourList | IFilterTextList

interface IFilterSchemaRange {
  type: 'range'
  subType: 'range' | 'rangerange' // rangerange is when values themselves are ranges, eg a 1000-1500 scoville
  name: string
  displayName: string
  domain: [min: number, max: number] // total range of possible values
}

interface IFilterRange extends IFilterSchemaRange {
  active: [min: number, max: number]
}
type IFilterSchema = IFilterSchemaList | IFilterSchemaRange
type IFilter = IFilterList | IFilterRange

interface IActionAddToWishlist {
  type: 'ADD'
  payload: string
}

interface IActionRemoveFromWishlist {
  type: 'REMOVE'
  payload: string
}

type IAction = IActionIncrementCount | IActionSetCount

interface IAppContext {
  state: IState
  actions: {
    addToWishlist: (handle: string) => void
    removeFromWishlist: (handle: string) => void
    hydrate: (handles: string[]) => void
  }
}

//page data

type IChilliPageData = {
  chillies: IChilli[]
  relatedChillies: IChilli[]
  requestType: 'listing' | 'handle' | null
  filters: IFilter[] | null
  pageContent: {
    title: string
    description: string
    content: string
    image: {
      src: string
      alt: sring
    }
  }
}
