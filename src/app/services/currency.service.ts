import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { Currency } from "../components/models/Currencies";
import { Coin } from "../components/models/Coins";

const BACKEND_COIN_URL = environment.backendApiUrl + "/coins";
const BACKEND_WALLET_URL = environment.backendApiUrl + "/wallets";
const BACKEND_LEADER_BOARD_URL = environment.backendApiUrl + "/leaderboards";
const CURRENCIES_URL = environment.currencyApiUrl;

@Injectable({
  providedIn: "root"
})
export class CurrencyService {
  //This is the list of currencies that we get from the api
  private currencies: Currency[] = [];

  //This is the list of currencies that we have purchased
  private coins: Coin[] = [];

  //This is the current dollar ammount in the active wallet
  private dollars: number = 0;

  //This is a leaderBoard of highest overall value portfolios

  //Registers change in currencies
  private currenciesUpdated = new Subject<Currency[]>();

  //Registers change in coins
  private coinsUpdated = new Subject<Coin[]>();

  //Registers change in dollars
  private dollarsUpdated = new Subject<number>();

  constructor(private http: HttpClient) {}

  makeWallet(){
    this.http.get(BACKEND_WALLET_URL/*, {name: "default",dollars: 1000 }*/).subscribe(response =>{
      console.log(response);
    })
  }
  getCurrencies() {
    return this.http
      .get<{ data: any; metadata: any }>(CURRENCIES_URL)
      .pipe(
        map(curData => {
          //Only the .data attribute is what we are interested in
          return curData.data.map(curCurrency => {
            return {
              id: curCurrency.id,
              name: curCurrency.name,
              symbol: curCurrency.symbol,
              rank: curCurrency.rank,
              circulating_supply: curCurrency.circulating_supply,
              total_supply: curCurrency.total_supply,
              max_supply: curCurrency.max_supply,
              USD: {
                price: curCurrency.quotes.USD.price,
                volume_24h: curCurrency.quotes.USD.volume_24h,
                market_cap: curCurrency.quotes.USD.market_cap,
                percent_change_1h: curCurrency.quotes.USD.percent_change_1h,
                percent_change_24h: curCurrency.quotes.USD.percent_change_24h,
                percent_change_7d: curCurrency.quotes.USD.percent_change_7d
              }
            };
          });
        })
      )
      .subscribe(extractedCurs => {
        this.currencies = extractedCurs;
        this.currenciesUpdated.next([...this.currencies]);
      });
  }

  getCoins() {
    this.http
      .get<{ message: string; coins: Coin[] }>(BACKEND_COIN_URL)
      .pipe(
        map(responseData => {
          return responseData.coins.map(curCoin => {
            return {
              id: curCoin.id,
              ammount: curCoin.ammount,
              wallet: curCoin.wallet
            };
          });
        })
      )
      .subscribe(transformedCoins => {
        this.coins = transformedCoins;
        this.coinsUpdated.next([...this.coins]);
      });
  }

  getDollars() {
    this.http
      .get<{ message: string; dollars: number }>(BACKEND_WALLET_URL+"/dollars")
      .subscribe(response => {
        if (response.dollars) {
          this.dollars = response.dollars;
          this.dollarsUpdated.next(this.dollars);
        }
      });
  }

  getLeaderBoard() {
    return this.http.get<any>(BACKEND_LEADER_BOARD_URL);
  }

  buyCoin(id: number, cost: number, wallet: string) {
    const coinToBuy = {
      id: id,
      cost: cost,
      wallet: wallet
    }
    this.http.post<{message: string, coin: Coin}>(BACKEND_COIN_URL, coinToBuy).subscribe(coin =>{
      console.log(coin)
    })
  }

  sellCoin(id: number, ammount: number) {
    /*
    const curPos = this.findItemPos(id, this.coins);
    const coin = {
      id: id,
      ammount: this.coins[curPos].ammount - ammount
    };
    const value =
      this.currencies[this.findItemPos(id, this.currencies)].USD.price *
      ammount;

    //Sets new dollar ammount after sale
    const newDollar = {
      id: 0,
      ammount: this.coins[0].ammount + value
    };

    this.http
      .put<{ message: string; coin: Coin }>(BACKEND_COIN_URL, coin)
      .subscribe(responseData => {
        //These values are changed here to insure request was successful
        this.coins[curPos].ammount = responseData.coin.ammount;
        this.updateDollar(newDollar);
        this.coinsUpdated.next([...this.coins]);
      });
    */
  }

  findItemPos(id: number, inArr: Array<any>) {
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

  getUpdatedDollarListerner() {
    return this.dollarsUpdated.asObservable();
  }
}
