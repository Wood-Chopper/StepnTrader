import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Sneaker} from "../model/sneaker.model";
import {Observable} from "rxjs";

const HISTORY_BASE_URL = '/api/history';

@Injectable({
  providedIn: 'root'
})
export class HistoryClient {
  constructor(private httpClient: HttpClient) {}

  public save(sneaker: Sneaker): Observable<Sneaker> {
    return this.httpClient.post<Sneaker>(HISTORY_BASE_URL, sneaker);
  }

  public getHistory(): Observable<Sneaker[]> {
    return this.httpClient.get<Sneaker[]>(HISTORY_BASE_URL);
  }
}
