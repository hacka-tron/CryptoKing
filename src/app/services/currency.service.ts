import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { Currency } from "../components/models/Currencies";
import { Coin } from "../components/models/Coins";
import { Wallet } from "../components/models/Wallet";

const BACKEND_COIN_URL = environment.backendApiUrl + "/coins";
const BACKEND_WALLET_URL = environment.backendApiUrl + "/wallets";
const BACKEND_LEADER_BOARD_URL = environment.backendApiUrl + "/leaderboards";
const BACKEND_USER_URL = environment.backendApiUrl + "/user";
const CURRENCIES_URL = environment.currencyApiUrl;

@Injectable({
  providedIn: "root"
})
export class CurrencyService {
  //This is the list of currencies that we get from the api
  private currencies: Currency[] = [];

  private activeWalletId: string;

  private wallets: Wallet[] = [];

  //This is the current dollar ammount in the active wallet
  private dollars: number = 0;

  //Registers change in currencies
  private currenciesUpdated = new Subject<Currency[]>();

  private walletsUpdated = new Subject<Wallet[]>();

  private activeWalletIdUpdated = new Subject<string>();

  //Registers change in dollars
  private dollarsUpdated = new Subject<number>();

  constructor(private http: HttpClient) {}

  getWallets() {
    this.http
      .get<{ message: string; walletArray: any }>(BACKEND_WALLET_URL)
      .pipe(
        map(responseData => {
          return responseData.walletArray.map(curWallet => {
            return {
              id: curWallet[0]._id,
              owner: curWallet[0].owner,
              name: curWallet[0].name,
              dollars: curWallet[0].dollars,
              coins: curWallet[1]
            };
          });
        })
      )
      .subscribe(wallets => {
        this.wallets = wallets;
        this.walletsUpdated.next([...this.wallets]);
      });
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

  getActiveWalletId() {
    this.http
      .get<{ message: string; wallet: any }>(
        BACKEND_WALLET_URL + "/activeWallet"
      )
      .subscribe(response => {
        if (response.wallet) {
          this.activeWalletId = response.wallet._id;
          this.activeWalletIdUpdated.next(this.activeWalletId);
        }
      });
  }
  getDollars() {
    this.http
      .get<{ message: string; dollars: number }>(
        BACKEND_WALLET_URL + "/dollars"
      )
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

  buyCoin(cost: number, coinId: number, walletId: string) {
    const coinToBuy = {
      coinId: coinId,
      cost: cost,
      walletId: walletId
    };
    this.http
      .post<{ message: string; coin: Coin; dollars: number }>(
        BACKEND_COIN_URL + "/buy",
        coinToBuy
      )
      .subscribe(response => {
        this.getWallets();
        this.dollars = response.dollars;
        this.dollarsUpdated.next(this.dollars);
      });
  }

  sellCoin(ammount: number, coinId: number, walletId: string) {
    const coinToSell = {
      coinId: coinId,
      ammount: ammount,
      walletId: walletId
    };
    this.http
      .put<{ message: string; coin: Coin; dollars: number }>(
        BACKEND_COIN_URL + "/sell",
        coinToSell
      )
      .subscribe(response => {
        this.getWallets();
        this.dollars = response.dollars;
        this.dollarsUpdated.next(this.dollars);
      });
  }

  changeActiveWallet(activeWalletId: string) {
    const changeWalletInfo = {
      walletId: activeWalletId
    };
    this.http
      .put<{ message: string; curWalletId: string }>(
        BACKEND_USER_URL + "/changeCurWallet",
        changeWalletInfo
      )
      .subscribe(response => {
        this.activeWalletId = response.curWalletId;
        this.activeWalletIdUpdated.next(this.activeWalletId);
      });
  }

  deleteWallet(walletId: string){
    this.http.delete<{message: string}>(BACKEND_WALLET_URL+ "/"+walletId).subscribe(response =>{
      this.getActiveWalletId();
      this.getWallets();
    })
  }
  changeWalletName(name: string, walletId: string) {
    const walletInfo = {
      name: name
    };
    this.http
      .put<{ message: string; wallet: any }>(
        BACKEND_WALLET_URL + "/changeName/" + walletId,
        walletInfo
      )
      .subscribe(response => {
        this.getWallets();
      });
  }

  findTotalValue(walletId: string) {
    //this.getCurrencies();
    //this.getWallets();
    const wallet = this.findItemById(walletId, this.wallets);
    var total = wallet.dollars;
    for (let coin of wallet.coins) {
      total +=
        coin.ammount * this.findItemById(coin.id, this.currencies).USD.price;
    }
    return total;
  }

  findActiveWalletById(activeWalletId: string) {
    for (let wallet of this.wallets) {
      if (activeWalletId == wallet.id) {
        return wallet;
      }
    }
    return;
  }
  getUpdatedCurrenciesListner() {
    return this.currenciesUpdated.asObservable();
  }

  getUpdatedWalletsListner() {
    return this.walletsUpdated.asObservable();
  }

  getUpdatedActiveWalletIdListner() {
    return this.activeWalletIdUpdated.asObservable();
  }
  getUpdatedDollarListerner() {
    return this.dollarsUpdated.asObservable();
  }
  findItemById(id: number | string, inArr: Array<any>) {
    for (var i = 0; i < inArr.length; i++) {
      if (inArr[i].id == id) {
        return inArr[i];
      }
    }
    return null;
  }
  createWallet(name: string, dollars: number) {
    const walletData = {
      name: name,
      dollars: dollars
    };
    this.http
      .post<{ message: string; wallet: any }>(BACKEND_WALLET_URL, walletData)
      .subscribe(response => {
        this.getWallets();
      });
  }
}
