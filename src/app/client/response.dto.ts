export interface ResponseDto {
  code: number,
  msg: string
}

export enum ResponseCode {
  SUCCESS = 0,
  NO_MONEY = 212008
}
