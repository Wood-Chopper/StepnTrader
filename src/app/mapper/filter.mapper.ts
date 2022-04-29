import {SneakerType} from "../model/sneaker.model";

export function mapTypeFilter(sneakerType: SneakerType): number {
  return +sneakerType;
}

export function mapLeverFilter(minLevel: number, maxLevel: number): number {
  return +((minLevel + 1).toString() + addLeadingZeros(maxLevel + 1, 3));
}

export function entityPriceToDtoPrice(price: number): number {
  return price * 1_000_000;
}

export function dtoPriceToEntityPrice(price: number): number {
  return price / 1_000_000;
}

function addLeadingZeros(num: number, totalLength: number): string {
  return String(num).padStart(totalLength, '0');
}
