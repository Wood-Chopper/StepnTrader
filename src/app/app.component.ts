import {Component} from '@angular/core';
import {interval, Observable, startWith, Subject, switchMap, takeUntil, tap} from "rxjs";
import {SneakerFinderFacade} from "./facade/sneaker-finder.facade";
import {Sneaker} from "./model/sneaker.model";
import {Filters, MaxPriceType} from "./model/filter.model";
import {SneakerBuyerFacade} from "./facade/sneaker-buyer.facade";
import {FilterSaveFacade} from "./facade/filter-save.facade";
import {BalanceDetail} from "./model/balance.model";
import {UserInfoFacade} from "./facade/user-info.facade";
import {MarketStat} from "./model/market.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  cookie: string = '';

  stoped$ = new Subject<boolean>();

  sneakers$: Subject<Sneaker[]> = new Subject<Sneaker[]>();

  sneakersHistory$: Observable<Sneaker[]>;

  missedHistory$: Observable<Sneaker[]>;

  balance$: Observable<BalanceDetail>;

  marketStat: MarketStat = {
    floorPrice: 0,
    avg: 0
  };

  filter: Filters = {
    type: null,
    maxLevel: 30,
    minLevel: 0,
    maxPrice: 13.5,
    maxSolAbove: 1.5,
    maxPriceType: MaxPriceType.FIXED
  }

  constructor(public sneakerFinderFacade: SneakerFinderFacade,
              private sneakerBuyerFacade: SneakerBuyerFacade,
              private filterSaveFacade: FilterSaveFacade,
              private userInfoFacade: UserInfoFacade) {
    this.sneakersHistory$ = sneakerBuyerFacade.sneakersHistory$;
    this.missedHistory$ = sneakerBuyerFacade.missedHistory$;
    this.sneakers$.subscribe(sneakers => sneakers.forEach(sn => this.sneakerBuyerFacade.analyseSneaker(sn)));
    this.filterSaveFacade.get().subscribe(filters => this.filter = filters);
    this.balance$ = this.userInfoFacade.balance$;
  }

  public stop(): void {
    this.stoped$.next(true)
  }

  public fetch(): void {
    document.cookie = "SESSIONIDD2=" + this.cookie.split('=').pop() + '; Path=/';
    this.userInfoFacade.refreshBalance();
    this.stoped$ = new Subject();

    interval(2700).pipe(
      tap(() => this.filterSaveFacade.save(this.filter)),
      takeUntil(this.stoped$),
      switchMap(() => this.sneakerFinderFacade.findSneakers(this.filter, this.marketStat.floorPrice))
    ).subscribe(v => this.sneakers$.next(v));

    interval(10000).pipe(
      takeUntil(this.stoped$),
      startWith(0),
      switchMap(() => this.sneakerFinderFacade.marketStat())
    ).subscribe(v => this.marketStat = v)

  }

}
