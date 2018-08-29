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
  dollarAmmount: number;
  currencies: Currency[];
  currencyProps: CurrencyProp[] = [];
  favNum: number = 0;
  curNum: number = 0;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit() {
    this.currencyService.getCurrencies();
    this.currencyService.getDollar();
    this.currencyService.getUpdatedDollarListner().subscribe(dollar => {
      this.dollarAmmount = dollar;
    });
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
}
