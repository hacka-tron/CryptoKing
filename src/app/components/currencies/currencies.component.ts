import { Component, OnInit, Input } from "@angular/core";
import { CurrencyService } from "../../services/currency.service";

import { Currency } from "../models/Currencies";
import { CurrencyProp } from "../models/CurrencyProps";
import { Coin } from "../models/Coins";
import { CoinProp } from "../models/CoinProps";



@Component({
  selector: "app-currencies",
  templateUrl: "./currencies.component.html",

  styleUrls: ["./currencies.component.css"]
})
export class CurrenciesComponent implements OnInit {
  currencies: Currency[];
  currencyProps: CurrencyProp[] = [];
  myCoins: Coin[] = [];
  coinProps: CoinProp[] = [];
  favNum: number = 0;
  curNum: number = 0;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit() {
    this.currencyService.getCurrencies();
    this.currencyService.getUpdatedCurrenciesListner().subscribe(currencies => {
      this.currencies = currencies;
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

    this.currencyService.getUpdatedCoinsListner().subscribe(coins =>{
      this.myCoins = coins;
    });

    this.coinProps.push({id: 0, hide: true, beingSold:0});
  }
  findTotalValue() {
    var totalVal = 0;
    for (var i = 0; i < this.myCoins.length; i++) {
      totalVal =
        totalVal +
        this.myCoins[i].ammount *
          this.findItemById(this.myCoins[i].id, this.currencies).quotes.USD
            .price;
    }
    return totalVal;
  }
  findItemById(id: number, inArr: Array<any>) {
    for (var i = 0; i < inArr.length; i++) {
      if (inArr[i].id == id) {
        return inArr[i];
      }
    }
    return null;
  }
  buyCoin(id: number, ammount: number) {
    if (confirm("Are You Sure?")) {
      this.currencyService.buyCoin(id, ammount);
      if(this.findItemById(id, this.coinProps) == null){
        this.coinProps.push({id: id, beingSold: 0, hide: true})
      }
      const curProp = this.findItemById(id, this.currencyProps);
      curProp.beingBought = 0;
      this.toggleToBuy(curProp);
    }
  }
  sellCoin(id: number, ammount: number) {
    if (confirm("Are You Sure?")) {
      this.currencyService.sellCoin(id, ammount);
      const coinProp = this.findItemById(id, this.coinProps);
      coinProp.beingSold = 0;
      this.toggleCoinHide(coinProp);
    }
  }
  toggleCoinHide(coinProp: CoinProp) {
    coinProp.hide = !coinProp.hide;
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
}
