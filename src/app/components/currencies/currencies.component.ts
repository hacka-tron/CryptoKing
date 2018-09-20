import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { CurrencyService } from "../../services/currency.service";

import { Currency } from "../models/Currencies";
import { CurrencyProp } from "../models/CurrencyProps";
import { Coin } from "../models/Coins";
import { CoinProp } from "../models/CoinProps";
import { Subscription } from "rxjs";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-currencies",
  templateUrl: "./currencies.component.html",

  styleUrls: ["./currencies.component.css"]
})
export class CurrenciesComponent implements OnInit, OnDestroy {
  dollarAmmount: number;
  currencies: Currency[];

  /*
  *This is used to set the properties for each currency, and this isn't saved in the databse as it is going to be *reset anyway up reloads
   */
  currencyProps: CurrencyProp[] = [];
  favNum: number = 0;
  curNum: number = 0;
  userIsAuthenticated = false;
  userName: string;
  private authListnerSubs: Subscription;

  constructor(
    private currencyService: CurrencyService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    //Certains buttons shouldn't appear when loged in/out
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListnerSubs = this.authService
      .getAuthStatusListner()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.currencyService.getCurrencies();
    this.currencyService.getDollar();
    this.currencyService.getUpdatedDollarListner().subscribe(dollar => {
      this.dollarAmmount = dollar;
    });
    this.currencyService.getUpdatedCurrenciesListner().subscribe(currencies => {
      this.currencies = currencies;

      //Adds the properties for the dollar currency
      this.currencies.forEach((cur, index) => {
        this.currencyProps.push({
          id: cur.id,
          hide: true,
          isFavorite: false,
          toBuy: false,
          beingBought: 0
        });
      });
    });
  }
  private findItemById(id: number, inArr: Array<any>) {
    return inArr[this.currencyService.findItemPos(id, inArr)];
  }
  buyCoin(id: number, ammount: number) {
    if (confirm("Are You Sure?")) {
      this.currencyService.buyCoin(id, ammount);
      const curProp = this.findItemById(id, this.currencyProps);
      curProp.beingBought = 0;
      this.toggleToBuy(curProp);
    }
  }

  toggleCurrencyHide(currencyProp: CurrencyProp) {
    if (currencyProp.toBuy) {
      this.toggleToBuy(currencyProp);
    }
    currencyProp.hide = !currencyProp.hide;
  }
  toggleToBuy(currencyProp: CurrencyProp) {
    if (!currencyProp.hide) {
      this.toggleCurrencyHide(currencyProp);
    }
    currencyProp.toBuy = !currencyProp.toBuy;
  }
  toggleFavorites(currencyProp: CurrencyProp) {
    currencyProp.isFavorite = !currencyProp.isFavorite;
    if (currencyProp.isFavorite) {
      this.favNum++;
    } else {
      this.favNum--;
    }
  }

  ngOnDestroy() {
    this.authListnerSubs.unsubscribe();
  }
}
