import {Injectable} from "@angular/core";
import {StepnClient} from "../client/stepn.client";
import {Sneaker, SneakerStatus} from "../model/sneaker.model";
import {HistoryClient} from "../client/history.client";
import {BehaviorSubject} from "rxjs";
import {entityPriceToDtoPrice} from "../mapper/filter.mapper";
import {ResponseCode} from "../client/response.dto";
import {minimumEfficiency, noPointWasted, primaryStatCriteria} from "../model/buy-criteria.model";
import {UserInfoFacade} from "./user-info.facade";

@Injectable({
  providedIn: 'root'
})
export class SneakerBuyerFacade {

  public sneakersHistory$: BehaviorSubject<Sneaker[]> = new BehaviorSubject<Sneaker[]>([])
  public missedHistory$: BehaviorSubject<Sneaker[]> = new BehaviorSubject<Sneaker[]>([])
  constructor(private stepnClient: StepnClient,
              private historyClient: HistoryClient,
              private userInfoFacade: UserInfoFacade) {
    this.historyClient.getBoughtHistory().subscribe(history => this.sneakersHistory$.next(history));
    this.historyClient.getMissedHistory().subscribe(history => this.missedHistory$.next(history));
  }

  public analyseSneaker(sneaker: Sneaker): void {
    if (sneaker.status !== SneakerStatus.NEW_LISTING) {
      return;
    }

    if (this.respectBuyCriterias(sneaker)) {
      this.buySneaker(sneaker);
    }
  }

  private respectBuyCriterias(sneaker: Sneaker): boolean {
    return primaryStatCriteria(sneaker)
      && minimumEfficiency(sneaker)
      && noPointWasted(sneaker);
  }

  public buySneaker(sneaker: Sneaker): void {
    this.stepnClient.buy(sneaker.orderId, entityPriceToDtoPrice(sneaker.price)).subscribe(response => {
      if (response.code === +ResponseCode.SUCCESS) {
        this.saveBought(sneaker);
        this.userInfoFacade.refreshBalance();
      } else {
        this.saveMissed(sneaker, response.msg);
      }
    })
  }

  private saveBought(sneaker: Sneaker): void {
    this.historyClient.saveBought(sneaker).subscribe();
    this.sneakersHistory$.next([ ...this.sneakersHistory$.getValue(), sneaker])
  }

  private saveMissed(sneaker: Sneaker, reason: string): void {
    const sneakerWithNote: Sneaker = { ...sneaker, note: reason, status: SneakerStatus.MISSED };
    this.historyClient.saveMissedOpportunity(sneakerWithNote).subscribe();
    this.missedHistory$.next([ ...this.missedHistory$.getValue(), sneakerWithNote])
  }
}
