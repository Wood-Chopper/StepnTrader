export interface SneakerSummaryDto {
  id: number,
  otd: number,
  propID: number,
  dataID: number,
  sellPrice: number, //1000000
  level: number,
  quality: number,
  mint: number,
  addRatio: number,
  v1: number,
  v2: number
}

export interface SneakerDto {
  id: number,
  orderId: number,
  type: number,
  dataID: number,
  level: number,
  quality: number,
  attrs: number[],
  breed: number,
  otd: number,
  price: number,
  newListing: boolean
}
