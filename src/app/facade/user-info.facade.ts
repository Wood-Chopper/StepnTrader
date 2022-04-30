import {Injectable} from "@angular/core";
import {StepnClient} from "../client/stepn.client";
import {BehaviorSubject, map, Observable} from "rxjs";
import {BalanceDetail} from "../model/balance.model";
import {AssetDto} from "../client/response.dto";

@Injectable({
  providedIn: 'root'
})
export class UserInfoFacade {

  public balance$: BehaviorSubject<BalanceDetail> = new BehaviorSubject<BalanceDetail>({
    gst: 0,
    gmt: 0,
    sol: 0
  })

  constructor(private stepnClient: StepnClient) {
  }

  public refreshBalance(): void {
    this.stepnClient.balance().pipe(
      map(balanceDto => ({
        gst: this.getBalanceForCode(balanceDto, 3000, 100),
        gmt: this.getBalanceForCode(balanceDto, 3001, 100),
        sol: this.getBalanceForCode(balanceDto, 1003, 1_000_000)
      }))
    ).subscribe(b => this.balance$.next(b));
  }

  private getBalanceForCode(balanceDto: AssetDto[], tokenCode: number, factor: number) {
    return balanceDto.filter(b => b.token === tokenCode).map(v => v.value / factor)[0];
  }
}
