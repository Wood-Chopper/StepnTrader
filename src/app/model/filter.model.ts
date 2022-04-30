import {SneakerType} from "./sneaker.model";

export interface Filters {
  maxPrice: number
  maxSolAbove: number
  maxPriceType: MaxPriceType

  minLevel: number
  maxLevel: number

  type: SneakerType | null
}

export enum OrderFilter {
  LATEST = 1002,
  CHEAPEST_FIRST = 2001,
}

export enum MaxPriceType {
  FIXED = '0',
  ABOVE_FLOOR = '1'
}
