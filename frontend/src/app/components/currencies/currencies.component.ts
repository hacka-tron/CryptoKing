import { Component, OnDestroy, OnInit } from "@angular/core";
import { CurrencyService } from "app/services/currency.service";
import { Subscription } from "rxjs";
import { Currency } from "../models/Currencies";
import { CurrencyProp } from "../models/CurrencyProps";
import { AuthService } from "app/services/auth.service";

@Component({
  selector: "app-currencies",
  templateUrl: "./currencies.component.html",
  styleUrls: ["./currencies.component.css"]
})
export class CurrenciesComponent implements OnInit, OnDestroy {
  currencies: Currency[];
  currencyProps: CurrencyProp[] = [];
  favoriteProps: CurrencyProp[] = [];

  userIsAuthenticated = false;

  curWalletId: string;
  dollarAmmount: number;

  isLoading: boolean =  true;

  private authListnerSubs: Subscription;
  private dollarListenerSubs: Subscription;
  private walletIdListenerSubs: Subscription;
  private currencyListenerSubs: Subscription;

  constructor(
    private currencyService: CurrencyService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    console.log('doing init');
    //Certains buttons shouldn't appear when loged in/out
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListnerSubs = this.authService
      .getAuthStatusListner()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    if (this.userIsAuthenticated) {
      this.currencyService.getDollars();
      this.dollarListenerSubs = this.currencyService
        .getUpdatedDollarListener()
        .subscribe(dollars => {
          this.dollarAmmount = dollars;
        });
      this.currencyService.getActiveWalletId();
      this.walletIdListenerSubs = this.currencyService
        .getUpdatedActiveWalletIdListner()
        .subscribe(activeWalletId => {
          this.curWalletId = activeWalletId;
        });
    }
    this.currencyService.getCurrencies();
    this.currencyListenerSubs = this.currencyService.getUpdatedCurrenciesListner()
      .subscribe(currencies => {
        this.currencies = currencies;
        this.currencyProps = [];

        //Adds the properties for the dollar currency
        this.currencies.forEach((cur, index) => {
          this.currencyProps.push({
            currency: cur,
            hide: true,
            isFavorite: false,
            toBuy: false,
            beingBought: 0
          });
        });
      });
      this.isLoading = false;
  }

  onFavoritePropAdded(currencyProp: CurrencyProp) {
    const curPropCopy = structuredClone(currencyProp);
    curPropCopy.toBuy = false;
    curPropCopy.hide = true;
    curPropCopy.beingBought = 0;
    this.favoriteProps.push(curPropCopy);
  }

  onFavoritePropRemoved(currencyProp: CurrencyProp) {
    const indOfFavorite = this.favoriteProps.findIndex(curProp => curProp.currency.id == currencyProp.currency.id);
    this.currencyProps.find(curProp => curProp.currency.id == currencyProp.currency.id).isFavorite = false;
    this.favoriteProps.splice(indOfFavorite, indOfFavorite + 1);
  }

  ngOnDestroy() {
    console.log('running on destroy');
    this.authListnerSubs.unsubscribe();
    this.currencyListenerSubs.unsubscribe();
    if (this.dollarListenerSubs) {
      this.dollarListenerSubs.unsubscribe();
    }
    if (this.walletIdListenerSubs) {
      this.walletIdListenerSubs.unsubscribe();
    }
  }
}
