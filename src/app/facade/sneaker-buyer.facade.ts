import {Injectable} from "@angular/core";
import {StepnClient} from "../client/stepn.client";
import {Sneaker} from "../model/sneaker.model";
import {HistoryClient} from "../client/history.client";
import {BehaviorSubject} from "rxjs";
import {entityPriceToDtoPrice} from "../mapper/filter.mapper";
import {ResponseCode} from "../client/response.dto";
import {maxMint2, minimumEfficiency, primaryStatCriteria, secondaryStatCriteria} from "../model/buy-criteria.model";

@Injectable({
  providedIn: 'root'
})
export class SneakerBuyerFacade {

  public sneakersHistory$: BehaviorSubject<Sneaker[]> = new BehaviorSubject<Sneaker[]>([])
  constructor(private stepnClient: StepnClient, private historyClient: HistoryClient) {
    this.historyClient.getHistory().subscribe(history => this.sneakersHistory$.next(history));
  }

  public analyseSneaker(sneaker: Sneaker): void {
    if (!sneaker.newListing) {
      return;
    }

    if (this.respectBuyCriterias(sneaker)) {
      this.buySneaker(sneaker);
    }
  }

  private respectBuyCriterias(sneaker: Sneaker): boolean {
    return primaryStatCriteria(sneaker) && secondaryStatCriteria(sneaker) && minimumEfficiency(sneaker);
  }

  public buySneaker(sneaker: Sneaker): void {
    this.stepnClient.buy(sneaker.orderId, entityPriceToDtoPrice(sneaker.price)).subscribe(response => {
      if (response.code === +ResponseCode.SUCCESS) {
        this.save(sneaker);
      }
    })
  }

  private save(sneaker: Sneaker): void {
    this.historyClient.save(sneaker).subscribe();
    this.sneakersHistory$.next([ ...this.sneakersHistory$.getValue(), sneaker])
  }
}
