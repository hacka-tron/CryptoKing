import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { Currency } from "../components/models/Currencies";
import { Coin } from "../components/models/Coins";

const BACKEND_COIN_URL = environment.backendApiUrl + "/coins";
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

  //This is a leaderBoard of highest overall value portfolios

  //Registers change in currencies
  private currenciesUpdated = new Subject<Currency[]>();

  //Registers change in coins
  private coinsUpdated = new Subject<Coin[]>();

  currenciesUrl: string =
  CURRENCIES_URL;

  constructor(private http: HttpClient) {}

  getCurrencies() {
    return this.http
      .get<{ data: any; metadata: any }>(this.currenciesUrl)
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
        //Add a default dollar currency at the front in order to perform conversions
        this.currencies.unshift({
          id: 0,
          name: "Dollar",
          symbol: "USD",
          rank: 0,
          circulating_supply: 0,
          total_supply: 0,
          max_supply: 0,
          USD: {
            price: 1,
            volume_24h: 0,
            market_cap: 0,
            percent_change_1h: 0,
            percent_change_24h: 0,
            percent_change_7d: 0
          }
        });
        this.currenciesUpdated.next([...this.currencies]);
      });
  }

  getCoins() {
    this.http
      .get<{ message: string; coins: Coin[] }>(
        BACKEND_COIN_URL
      )
      .pipe(
        map(responseData => {
          return responseData.coins.map(curCoin => {
            return {
              id: curCoin.id,
              ammount: curCoin.ammount,
              creator: curCoin.creator
            };
          });
        })
      )
      .subscribe(transformedCoins => {
        this.coins = transformedCoins;
        this.coinsUpdated.next([...this.coins]);
      });
  }

  getLeaderBoard(){
    return this.http.get<any>(BACKEND_LEADER_BOARD_URL);
  }

  buyCoin(id: number, ammount: number) {
    const coin = {
      id: id,
      ammount: ammount
    };
    const value =
      this.currencies[this.findItemPos(id, this.currencies)].USD.price *
      ammount;

    //Sets the changed dollar ammount after the purchase of the coin
    const newDollar = {
      id: 0,
      ammount: this.coins[0].ammount - value
    };
    const curPos = this.findItemPos(id, this.coins);

    //Checks if the user already owns some of this coin, in which case we update the coin ammount
    if (curPos != null) {
      coin.ammount = this.coins[curPos].ammount + coin.ammount;
      this.http
        .put<{ message: string; coin: Coin }>(
          BACKEND_COIN_URL,
          coin
        )
        .subscribe(responseData => {
          //These values are changed here to insure request was successful
          this.coins[curPos].ammount = responseData.coin.ammount;
          this.coinsUpdated.next([...this.coins]);
          this.updateDollar(newDollar);
        });
    } else {
      //In this case the user is purchasing some of a coin for the first time
      this.http
        .post<{ message: string; coin: Coin }>(
          BACKEND_COIN_URL,
          coin
        )
        .subscribe(responseData => {
          const newCoin = {
            id: responseData.coin.id,
            ammount: responseData.coin.ammount,
            creator: responseData.coin.creator
          };
          this.coins.push(newCoin);
          this.coinsUpdated.next([...this.coins]);
          this.updateDollar(newDollar);
        });
    }
  }

  private updateDollar(newDollar: { id: number; ammount: number }) {
    this.http
      .put<{ message: string; coin: Coin }>(
        BACKEND_COIN_URL,
        newDollar
      )
      .subscribe(responseData => {
        const newCoinAmmount = responseData.coin.ammount;
        this.coins[0].ammount = newCoinAmmount;
        this.coinsUpdated.next(this.coins);
      });
  }

  sellCoin(id: number, ammount: number) {
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
      .put<{ message: string; coin: Coin }>(
        BACKEND_COIN_URL,
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

  getUpdatedCurrenciesListner() {
    return this.currenciesUpdated.asObservable();
  }

  getUpdatedCoinsListner() {
    return this.coinsUpdated.asObservable();
  }
}
