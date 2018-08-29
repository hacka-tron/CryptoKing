import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
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
  private dollar: number;
  private currenciesUpdated = new Subject<Currency[]>();
  private coinsUpdated = new Subject<Coin[]>();
  private dollarUpdated = new Subject<number>();
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
        this.currenciesUpdated.next([...this.currencies]);
      });
  }

  getCoins() {
    this.http
      .get<{ message: string; coins: Coin[] }>(
        "http://localhost:3000/api/coins"
      )
      .pipe(
        map(responseData => {
          return responseData.coins.map(curCoin => {
            return {
              id: curCoin.id,
              ammount: curCoin.ammount
            };
          });
        })
      )
      .subscribe(transformedCoins => {
        this.coins = transformedCoins;

        if (this.coins.length == 0) {
          const dollar = { id: 0, ammount: 1000 };
          this.http
            .post<{ message: string; coin: Coin }>(
              "http://localhost:3000/api/coins",
              dollar
            )
            .subscribe(responseData2 => {
              const transformedCoin: Coin = {
                id: responseData2.coin.id,
                ammount: responseData2.coin.ammount
              };
              this.coins.push(transformedCoin);
              this.coinsUpdated.next([...this.coins]);
            });
        }
        this.coinsUpdated.next([...this.coins]);
      });
  }

  buyCoin(id: number, ammount: number) {
    const coin: Coin = {
      id: id,
      ammount: ammount
    };
    const value =
      this.currencies[this.findItemPos(id, this.currencies)].quotes.USD.price *
      ammount;
    const newDollar: Coin = {
      id: 0,
      ammount: this.coins[0].ammount - value
    };
    const curPos = this.findItemPos(id, this.coins);
    if (curPos != null) {
      coin.ammount = this.coins[curPos].ammount + coin.ammount;
      this.http
        .put<{ message: string; coin: Coin }>(
          "http://localhost:3000/api/coins",
          coin
        )
        .subscribe(responseData => {
          this.coins[curPos].ammount = responseData.coin.ammount;
          this.updateDollar(newDollar);
          this.coinsUpdated.next([...this.coins]);
        });
    } else {
      this.http
        .post<{ message: string; coin: Coin }>(
          "http://localhost:3000/api/coins",
          coin
        )
        .subscribe(responseData => {
          const newCoin = {
            id: responseData.coin.id,
            ammount: responseData.coin.ammount
          };
          this.coins.push(newCoin);
          this.updateDollar(newDollar);
          this.coinsUpdated.next([...this.coins]);
        });
    }
  }

  private updateDollar(newDollar: Coin) {
    this.http
      .put<{ message: string; coin: Coin }>(
        "http://localhost:3000/api/coins",
        newDollar
      )
      .subscribe(responseData2 => {
        this.coins[0].ammount = responseData2.coin.ammount;
      });
  }

  sellCoin(id: number, ammount: number) {
    const curPos = this.findItemPos(id, this.coins);
    const coin: Coin = {
      id: id,
      ammount: this.coins[curPos].ammount - ammount
    };
    const value =
      this.currencies[this.findItemPos(id, this.currencies)].quotes.USD.price *
      ammount;
    const newDollar: Coin = {
      id: 0,
      ammount: this.coins[0].ammount + value
    };

    this.http
      .put<{ message: string; coin: Coin }>(
        "http://localhost:3000/api/coins",
        coin
      )
      .subscribe(responseData => {
        this.coins[curPos].ammount = responseData.coin.ammount;
        this.updateDollar(newDollar);
        this.coinsUpdated.next([...this.coins]);
      });
  }

  findItemPos(id: number, inArr: Array<any>) {
    for (var i = 0; i < inArr.length; i++) {
      if (inArr[i].id == id) {
        return i;
      }
    }
    return null;
  }

  getDollar() {
    return this.http
      .get<{ id: number; ammount: number }>(
        "http://localhost:3000/api/coins/" + 0
      )
      .subscribe(coinData => {
        this.dollar = coinData.ammount;
        this.dollarUpdated.next(this.dollar);
      });
  }
  getUpdatedCurrenciesListner() {
    return this.currenciesUpdated.asObservable();
  }

  getUpdatedCoinsListner() {
    return this.coinsUpdated.asObservable();
  }

  getUpdatedDollarListner() {
    return this.dollarUpdated.asObservable();
  }
}
