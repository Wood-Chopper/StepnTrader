import {Component} from '@angular/core';
import {interval, Observable, startWith, Subject, switchMap, takeUntil, tap} from "rxjs";
import {SneakerFinderFacade} from "./facade/sneaker-finder.facade";
import {Sneaker, SneakerType} from "./model/sneaker.model";
import {Filters} from "./model/filter.model";
import {SneakerBuyerFacade} from "./facade/sneaker-buyer.facade";
import {FilterSaveFacade} from "./facade/filter-save.facade";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  cookie: string = '';

  stoped$ = new Subject<boolean>();

  sneakers$: Subject<Sneaker[]> = new Subject<Sneaker[]>();

  sneakersHistory$: Observable<Sneaker[]>;

  floorPrice$: Subject<number> = new Subject<number>();

  filter: Filters = {
    type: null,
    maxLevel: 30,
    minLevel: 0,
    maxPrice: 13.5,
    minPrice: 0
  }

  constructor(public sneakerFinderFacade: SneakerFinderFacade,
              private sneakerBuyerFacade: SneakerBuyerFacade,
              private filterSaveFacade: FilterSaveFacade) {
    this.sneakersHistory$ = sneakerBuyerFacade.sneakersHistory$;
    this.sneakers$.subscribe(sneakers => {
      sneakers.forEach(sn => this.sneakerBuyerFacade.analyseSneaker(sn))
    });
    this.filterSaveFacade.get().subscribe(filters => this.filter = filters);
  }

  public stop(): void {
    this.stoped$.next(true)
  }

  public fetch(): void {
    document.cookie = "SESSIONIDD2=" + this.cookie.split('=').pop() + '; Path=/';

    this.stoped$ = new Subject();

    interval(2000).pipe(
      tap(() => this.filterSaveFacade.save(this.filter)),
      takeUntil(this.stoped$),
      switchMap(() => this.sneakerFinderFacade.findSneakers(this.filter))
    ).subscribe(v => this.sneakers$.next(v));

    interval(10000).pipe(
      takeUntil(this.stoped$),
      startWith(0),
      switchMap(() => this.sneakerFinderFacade.floorPrice())
    ).subscribe(v => this.floorPrice$.next(v));
  }

}
