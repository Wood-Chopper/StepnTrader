import {Sneaker} from "./sneaker.model";

export function minimumEfficiency(sneaker: Sneaker): boolean {
  return sneaker.efficiency.base >= 6
}

export function primaryStatCriteria(sneaker: Sneaker): boolean {
  return sneaker.efficiency.base + sneaker.resilience.base >= 15
}

export function secondaryStatCriteria(sneaker: Sneaker): boolean {
  return sneaker.comfort.base + sneaker.luck.base >= 6;
}

export function maxMint2(sneaker: Sneaker): boolean {
  return sneaker.breed <= 2;
}

export const MAX_GLOBAL_SCORE = 250;

const EFFICIENCY_WEIGHT = 10;//100
const RESILIENCE_WEIGHT = 10;//100
const COMFORT_WEIGHT = 1;//10
const LUCK_WEIGHT = 2;//20
const LEVEL_WEIGHT = 2;//20
const WASTED_POINTS_WEIGHT = -1;
const BREED_WEIGHT = -3;

export function globalScore(sneaker: Sneaker): number {
  let score = 0;
  score += EFFICIENCY_WEIGHT * sneaker.efficiency.base;
  score += RESILIENCE_WEIGHT * sneaker.resilience.base;
  score += COMFORT_WEIGHT * sneaker.comfort.base;
  score += LUCK_WEIGHT * sneaker.luck.base;
  score += LEVEL_WEIGHT * sneaker.level;
  score += BREED_WEIGHT * sneaker.breed;
  score += WASTED_POINTS_WEIGHT * sneaker.comfort.added;
  score += WASTED_POINTS_WEIGHT * sneaker.luck.added;

  const maxAllowedResilience = sneaker.level <= 13 ? 10.9
    : sneaker.level <= 24 ? 14.9
      : 22.9;

  let resilience = sneaker.resilience.base + sneaker.resilience.added;

  let wastedResilience = resilience - maxAllowedResilience;
  if (wastedResilience > 0) {
    score += WASTED_POINTS_WEIGHT * Math.ceil(wastedResilience);
  }

  return Math.round(score);
}
