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
  config: IConfig | null
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

interface IActionSetConfig {
  type: 'SET_CONFIG'
  payload: IConfig
}

type IAction = IActionIncrementCount | IActionSetCount | IActionSetConfig

type TSort = { dir: 'asc' | 'desc'; by: string } | null

interface IAppContext {
  state: IState
  actions: {
    setConfig: (config: IConfig) => void
    addToWishlist: (handle: string) => void
    removeFromWishlist: (handle: string) => void
    hydrate: (handles: string[]) => void
  }
}

interface IPaginationItem {
  pageNo: number
  url: string
}

//page data

type ICultivarPageData = {
  cultivars: ICultivar[]
  relatedCultivars: ICultivar[]
  requestType: 'listing' | 'handle' | null
  filters: IFilter[] | null
  count: number
  sort: TSort
  page: number
  pagination: IPaginationItem[]
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

//config
interface ISortKeyValue {
  text: string
  column: string
  urlKey: string
  objectKey: string
}
interface IConfig {
  sortKeys: ISortKeyValue[]
  perPage: number
}
