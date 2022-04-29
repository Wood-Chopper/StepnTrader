import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Sneaker} from "../model/sneaker.model";
import {Observable} from "rxjs";

const HISTORY_BASE_URL = '/api/history';
const MISSED_BASE_URL = '/api/missed';

@Injectable({
  providedIn: 'root'
})
export class HistoryClient {
  constructor(private httpClient: HttpClient) {}

  public saveBought(sneaker: Sneaker): Observable<Sneaker> {
    return this.httpClient.post<Sneaker>(HISTORY_BASE_URL, sneaker);
  }

  public getBoughtHistory(): Observable<Sneaker[]> {
    return this.httpClient.get<Sneaker[]>(HISTORY_BASE_URL);
  }

  public saveMissedOpportunity(sneaker: Sneaker): Observable<Sneaker> {
    return this.httpClient.post<Sneaker>(MISSED_BASE_URL, sneaker);
  }

  public getMissedHistory(): Observable<Sneaker[]> {
    return this.httpClient.get<Sneaker[]>(MISSED_BASE_URL);
  }
}
