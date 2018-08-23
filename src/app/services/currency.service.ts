import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import { Currency } from "../components/models/Currencies";
import { Coin } from "../components/models/Coins";

// const httpOptions = {
//   headers: new HttpHeaders({ "Content-Type": "application/json" })
// };
@Injectable({
  providedIn: "root"
})
export class CurrencyService {
  private currencies: Currency[] = [];
  private coins: Coin[] = [];
  private currenciesUpdated = new Subject<Currency[]>();
  private coinsUpdated = new Subject<Coin[]>();
  currenciesUrl: string =
    "https://api.coinmarketcap.com/v2/ticker/?structure=array";

  constructor(private http: HttpClient) {}

  getCurrencies() {
    return this.http
      .get<{ data: Currency[]; metadata: any }>(this.currenciesUrl)
      .pipe(
        map(curData => {
          return curData.data;
        })
      )
      .subscribe(extractedCurs => {
        this.currencies = extractedCurs;
        this.currencies.unshift({
          id: 0,
          name: "Dollar",
          symbol: "USD",
          rank: 0,
          circulating_supply: 0,
          total_supply: 0,
          max_supply: 0,
          quotes: {
            USD: {
              price: 1,
              volume_24h: 0,
              market_cap: 0,
              percent_change_1h: 0,
              percent_change_24h: 0,
              percent_change_7d: 0
            }
          }
        });
        const dollar = { id: 0, ammount: 1000, hide: true, beingSold: 0 };
        this.coins.push(dollar);
        this.coinsUpdated.next([...this.coins]);
        this.currenciesUpdated.next([...this.currencies]);
      });
  }

  buyCoin(id: number, ammount: number) {
    const curPos = this.findItemPos(id, this.coins);
    if (curPos != null) {
      this.coins[curPos].ammount = this.coins[curPos].ammount + ammount;
    } else {
      this.coins.push({ id: id, ammount: ammount });
    }
    const value =
      this.currencies[this.findItemPos(id, this.currencies)].quotes.USD.price *
      ammount;
    this.coins[0].ammount = this.coins[0].ammount - value;
    this.coinsUpdated.next([...this.coins]);
  }

  sellCoin(id: number, ammount: number) {
    const curPos = this.findItemPos(id, this.coins);
    this.coins[curPos].ammount = this.coins[curPos].ammount - ammount;
    const value =
      this.currencies[this.findItemPos(id, this.currencies)].quotes.USD.price *
      ammount;
    this.coins[0].ammount = this.coins[0].ammount + value;
    this.coinsUpdated.next([...this.coins]);
  }

  private findItemPos(id: number, inArr: Array<any>) {
    for (var i = 0; i < inArr.length; i++) {
      if (inArr[i].id == id) {
        return i;
      }
    }
    return null;
  }

  getUpdatedCurrenciesListner() {
    return this.currenciesUpdated.asObservable();
  }

  getUpdatedCoinsListner() {
    return this.coinsUpdated.asObservable();
  }
}
