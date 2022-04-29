import {Component, Input} from '@angular/core';
import {PropertyType, Sneaker, SneakerProperty, SneakerStatus, SneakerType} from "../model/sneaker.model";
import {typeToStringMapper} from "../mapper/sneaker.mapper";
import {SneakerBuyerFacade} from "../facade/sneaker-buyer.facade";
import {globalScore, MAX_GLOBAL_SCORE} from "../model/buy-criteria.model";
import {scoreToRgb} from "../utils/colors.utils";

@Component({
  selector: 'app-sneakers-table',
  templateUrl: './sneakers-table.component.html'
})
export class SneakersTableComponent {

  PropertyType = PropertyType;
  SneakerStatus = SneakerStatus;
  MAX_GLOBAL_SCORE = MAX_GLOBAL_SCORE;

  @Input()
  sneakers: Sneaker[] | null = [];

  @Input()
  buyOption: boolean = false;

  @Input()
  noteColumn: boolean = false;

  constructor(private sneakerBuyerFacade: SneakerBuyerFacade) {
  }

  typeToString(type: SneakerType): string {
    return typeToStringMapper(type);
  }

  definePropertyColor(type: PropertyType, property: SneakerProperty): string {
    let base = property.base;
    let added = property.added;

    switch (type) {
      case PropertyType.COMFORT:
      case PropertyType.LUCK:
        if (added > 0) {
          return 'rgb(255, 0, 255)'
        }
    }

    return scoreToRgb(base, 10)
  }

  defineScoreColor(score: number): string {
    return scoreToRgb(score, MAX_GLOBAL_SCORE)
  }

  buy(sneaker: Sneaker): void {
    this.sneakerBuyerFacade.buySneaker(sneaker);
  }

  globalScore(sneaker: Sneaker): number {
    return globalScore(sneaker);
  }
}
