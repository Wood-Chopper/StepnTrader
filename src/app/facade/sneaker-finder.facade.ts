import {Injectable} from "@angular/core";
import {StepnClient} from "../client/stepn.client";
import {combineLatest, concatMap, flatMap, map, Observable, of, switchMap, tap} from "rxjs";
import {Sneaker} from "../model/sneaker.model";
import {Filters, OrderFilter} from "../model/filter.model";
import {mapLeverFilter, entityPriceToDtoPrice, mapTypeFilter} from "../mapper/filter.mapper";
import {sneakerMapperList} from "../mapper/sneaker.mapper";
import {SneakerDto, SneakerSummaryDto} from "../client/sneaker.dto";

@Injectable({
  providedIn: 'root'
})
export class SneakerFinderFacade {

  private sneakerCache: Map<number, SneakerDto> = new Map();

  constructor(private stepnClient: StepnClient) {
  }

  public findSneakers(filter: Filters): Observable<Sneaker[]> {
    let typeFilter = filter.type ? mapTypeFilter(filter.type) : null;
    let levelFilter = filter.minLevel <= 0 && filter.maxLevel >= 30 ? null : mapLeverFilter(filter.minLevel, filter.maxLevel);
    let maxPriceFilter = entityPriceToDtoPrice(filter.maxPrice);
    let minPriceFilter = entityPriceToDtoPrice(filter.minPrice);

    return this.stepnClient.listSneakers(+OrderFilter.LATEST, typeFilter, levelFilter).pipe(
      map(sneakersDto => sneakersDto.filter(sneaker => sneaker.sellPrice <= maxPriceFilter)
        .filter(sneaker => sneaker.sellPrice >= minPriceFilter)),
      switchMap(sneakersDto => sneakersDto.length ? combineLatest(sneakersDto.map(snd => this.getSneakerDetails(snd))) : of([])),
      map(sneakerDtos => sneakerDtos.filter(snd => snd !== null)),
      // @ts-ignore
      map(sneakerDtos => sneakerMapperList(sneakerDtos)),
    )
  }

  public floorPrice(): Observable<number> {
    return this.stepnClient.listSneakers(OrderFilter.CHEAPEST_FIRST).pipe(
      map(sneakers => sneakers[0].sellPrice / 1_000_000)
    );
  }

  private getSneakerDetails(snd: SneakerSummaryDto): Observable<SneakerDto | null> {
    const cachedSneaker = this.sneakerCache.get(snd.id);
    const sneakerDto$ = cachedSneaker ? of(cachedSneaker) : this.stepnClient.sneakerDetails(snd.id);

    return sneakerDto$.pipe(
      // @ts-ignore
      map(v => v ? ({ ...v, orderId: snd.id, price: snd.sellPrice, newListing: !cachedSneaker }) : null),
      tap(v => v ? this.sneakerCache.set(snd.id, v) : null)
    );
  }
}
