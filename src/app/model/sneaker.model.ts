export interface Sneaker {
  orderId: number,
  id: number,
  type: SneakerType,
  level: number,
  breed: number,

  efficiency: SneakerProperty
  luck: SneakerProperty
  comfort: SneakerProperty
  resilience: SneakerProperty

  price: number,
  newListing: boolean
}

export enum SneakerType {
  WALKER= 601,
  JOGGER = 602,
  RUNNER = 603,
  TRAINER= 604
}

export interface SneakerProperty {
  base: number,
  added: number
}
export enum PropertyType {
  EFFICIENCY,
  LUCK,
  COMFORT,
  RESILIENCE
}
