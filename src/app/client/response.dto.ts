export interface ResponseDto {
  code: number,
  msg: string
}

export enum ResponseCode {
  SUCCESS = 0,
  NO_MONEY = 212008,
  ORDER_DO_NOT_EXISTS = 212006
}

export interface AssetDto {
  token: number,
  value: number
}
