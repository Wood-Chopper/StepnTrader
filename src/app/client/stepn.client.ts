import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {SneakerDto, SneakerSummaryDto} from "./sneaker.dto";
import {ResponseDto} from "./response.dto";

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
      order: order
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

  public sneakerDetails(orderId: number): Observable<SneakerDto | ResponseDto> {
    return this.httpClient.get<{data: SneakerDto}>(STEPN_BASE_URL + '/orderdata', {
      params: {
        orderId: orderId
      }
    }).pipe(
      map(v => v.data)
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
}
