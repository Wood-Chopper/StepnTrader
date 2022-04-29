import {SneakerType} from "./sneaker.model";

export interface Filters {
  minPrice: number
  maxPrice: number

  minLevel: number
  maxLevel: number

  type: SneakerType | null
}

export enum OrderFilter {
  LATEST = 1002,
  CHEAPEST_FIRST = 2001,
}
