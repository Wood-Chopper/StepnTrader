import {Injectable} from "@angular/core";
import {FiltersSaveClient} from "../client/filters-save.client";
import {Filters} from "../model/filter.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FilterSaveFacade {
  constructor(private filtersSaveClient: FiltersSaveClient) {}

  public save(filters: Filters): void {
    this.filtersSaveClient.save(filters).subscribe();
  }

  public get(): Observable<Filters> {
    return this.filtersSaveClient.get();
  }
}
