import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Currency } from "../components/models/Currencies";
import { Coin } from "../components/models/Coins";

@Injectable({
  providedIn: "root"
})
export class CurrencyService {
  //This is the list of currencies that we get from the api
  private currencies: Currency[] = [];

  //This is the list of currencies that we have purchased
  private coins: Coin[] = [];

  private dollar: number;

  //Registers change in currencies
  private currenciesUpdated = new Subject<Currency[]>();

  //Registers change in coins
  private coinsUpdated = new Subject<Coin[]>();

  //Registers change in dollar
  private dollarUpdated = new Subject<number>();

  currenciesUrl: string =
    "https://api.coinmarketcap.com/v2/ticker/?structure=array";

  constructor(private http: HttpClient) {}

  getCurrencies() {
    return this.http
      .get<{ data: Currency[]; metadata: any }>(this.currenciesUrl)
      .pipe(
        map(curData => {
          //Only the .data attribute is what we are interested in
          return curData.data;
        })
      )
      .subscribe(extractedCurs => {
        this.currencies = extractedCurs;
        //Add a default dollar currency at the front in order to perform conversions
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

        //Adds a dollar coin if coins doesnt have one yet. Default ammount of dollars is set to 1000
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

    //Sets the changed dollar ammount after the purchase of the coin
    const newDollar: Coin = {
      id: 0,
      ammount: this.coins[0].ammount - value
    };
    const curPos = this.findItemPos(id, this.coins);

    //Checks if the user already owns some of this coin, in which case we update the coin ammount
    if (curPos != null) {
      coin.ammount = this.coins[curPos].ammount + coin.ammount;
      this.http
        .put<{ message: string; coin: Coin }>(
          "http://localhost:3000/api/coins",
          coin
        )
        .subscribe(responseData => {
          //These values are changed here to insure request was successful
          this.coins[curPos].ammount = responseData.coin.ammount;
          this.updateDollar(newDollar);
          this.coinsUpdated.next([...this.coins]);
        });
    } else { //In this case the user is purchasing some of a coin for the first time
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

    //Sets new dollar ammount after sale
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
        //These values are changed here to insure request was successful
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
