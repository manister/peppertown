interface ICultivar {
  name: string
  handle: string
  desc: string
  scovilleMax: number
  scovilleMin: number
  ttm: number
  colour: IColour | null
  species: ISpecies | null
  image: IImage | null
  origin: IOrigin | null
}

interface IColour {
  name: string
  handle: string
  r: number
  g: number
  b: number
}

interface ISpecies {
  name: string
  handle: string
}

interface IImage {
  name: string
  handle: string
  alt: string
  attribution: string
}

interface IOrigin {
  name: string
  handle: string
}

interface IState {
  wishlist: Set<string>
}

interface IFilterBaseValue {
  value: string
  displayValue: string
}

interface IFilterValue {
  value: string
  displayValue: string
  active: boolean
}

interface IFilterSchemaColourValue extends IFilterBaseValue {
  displayType: 'colour'
  rgb: [number, number, number]
}

interface IFilterSchemaTextValue extends IFilterBaseValue {
  displayType: 'text'
}

type IFilterSchemaValue = IFilterSchemaColourValue | IFilterSchemaTextValue

interface IFilterColourValue extends IFilterSchemaColourValue {
  active: boolean
}

interface IFilterTextValue extends IFilterSchemaTextValue {
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
  values: IFilterColourValue[]
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

interface IFilterSchemaSimpleRange {
  type: 'range'
  name: string
  displayName: string
  domain: [min: number, max: number] // total range of possible values
}

interface IFilterSchemaDoubleRange {
  // double is when values themselves are ranges, eg a 1000-1500 scoville
  type: 'doublerange'
  name: string
  nameMin: string
  nameMax: string
  displayName: string
  domain: [min: number, max: number] // total range of possible values
}

type IFilterSchemaRange = IFilterSchemaDoubleRange | IFilterSchemaSimpleRange

interface IFilterSimpleRange extends IFilterSchemaSimpleRange {
  active: [min: number, max: number]
}

interface IFilterDoubleRange extends IFilterSchemaDoubleRange {
  active: [min: number, max: number]
}

type IFilterSchema = IFilterSchemaList | IFilterSchemaDoubleRange | IFilterSchemaSimpleRange
type IFilter = IFilterList | IFilterSimpleRange | IFilterDoubleRange

interface IActionAddToWishlist {
  type: 'ADD'
  payload: string
}

interface IActionRemoveFromWishlist {
  type: 'REMOVE'
  payload: string
}

type IAction = IActionIncrementCount | IActionSetCount

type TSort = { dir: 'asc' | 'desc'; by: string } | null

interface IAppContext {
  state: IState
  actions: {
    addToWishlist: (handle: string) => void
    removeFromWishlist: (handle: string) => void
    hydrate: (handles: string[]) => void
  }
}

//page data

type ICultivarPageData = {
  chillies: ICultivar[]
  relatedChillies: ICultivar[]
  requestType: 'listing' | 'handle' | null
  filters: IFilter[] | null
  count: number
  sort: TSort
  page: number
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
