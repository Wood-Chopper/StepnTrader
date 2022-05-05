import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {SneakerDto, SneakerSummaryDto} from "./sneaker.dto";
import {AssetDto, ResponseDto} from "./response.dto";

const STEPN_BASE_URL = '/stepn/run';

@Injectable({
  providedIn: 'root'
})
export class StepnClient {
  constructor(private httpClient: HttpClient) {}

  public listSneakers(order: number, type?: number | null, levelFilter?: number | null): Observable<SneakerSummaryDto[]> {
    let params: any = {
      chain: 103,
      refresh: true,
      order: order,
      quality: 1
    };
    if (type) {
      params['type'] = type
    }
    if (levelFilter) {
      params['level'] = levelFilter
    }
    return this.httpClient.get<{data: SneakerSummaryDto[]}>(STEPN_BASE_URL + '/orderlist', {
      params: params
    }).pipe(
      map(v => v.data)
    );
  }

  public sneakerDetails(orderId: number): Observable<SneakerDto | null> {
    return this.httpClient.get<{data: SneakerDto}>(STEPN_BASE_URL + '/orderdata', {
      params: {
        orderId: orderId
      }
    }).pipe(
      map(v => v.data ? v.data : null)
    );
  }

  public buy(orderId: number, price: number): Observable<ResponseDto> {
    return this.httpClient.get<ResponseDto>(STEPN_BASE_URL + '/buyprop', {
      params: {
        orderID: orderId,
        price: price
      }
    })
  }

  public sell(propId: number, price: number): Observable<ResponseDto> {
    return this.httpClient.get<ResponseDto>(STEPN_BASE_URL + '/addprop', {
      params: {
        propID: propId,
        price: price
      }
    })
  }

  public balance(): Observable<AssetDto[]> {
    return this.httpClient.get<{data: { asset: AssetDto[] }}>(STEPN_BASE_URL + '/userbasic').pipe(
      map(v => v.data.asset)
    );
  }
}
