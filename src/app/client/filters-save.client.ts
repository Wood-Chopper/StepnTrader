import {HttpClient} from "@angular/common/http";
import {Sneaker} from "../model/sneaker.model";
import {Observable} from "rxjs";
import {Filters} from "../model/filter.model";
import {Injectable} from "@angular/core";

const FILTERS_BASE_URL = '/api/filters';

@Injectable({
  providedIn: 'root'
})
export class FiltersSaveClient {
  constructor(private httpClient: HttpClient) {}

  public save(filter: Filters): Observable<Sneaker> {
    return this.httpClient.post<Sneaker>(FILTERS_BASE_URL, filter);
  }

  public get(): Observable<Filters> {
    return this.httpClient.get<Filters>(FILTERS_BASE_URL);
  }
}
