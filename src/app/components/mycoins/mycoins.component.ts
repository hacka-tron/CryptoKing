import { Component, OnInit } from "@angular/core";

import { CurrencyService } from "../../services/currency.service";

import { Currency } from "../models/Currencies";
import { Coin } from "../models/Coins";
import { CoinProp } from "../models/CoinProps";
import { Chart } from "chart.js";

@Component({
  selector: "app-mycoins",
  templateUrl: "./mycoins.component.html",
  styleUrls: ["./mycoins.component.css"]
})
export class MycoinsComponent implements OnInit {
  myCoins: Coin[] = [];
  coinProps: CoinProp[] = [];
  currencies: Currency[];
  constructor(private currencyService: CurrencyService) {}

  ngOnInit() {
    this.currencyService.getCurrencies();
    this.currencyService.getCoins();
    this.currencyService.getUpdatedCoinsListner().subscribe(coins => {
      this.myCoins = coins;
      this.myCoins.forEach((cur, index) => {
        this.coinProps.push({
          id: cur.id,
          hide: true,
          beingSold: 0
        });
      });
    });

    this.currencyService.getUpdatedCurrenciesListner().subscribe(currencies => {
      this.currencies = currencies;
    });
  }
  findTotalValue() {
    var totalVal = 0;
    for (var i = 0; i < this.myCoins.length; i++) {
      totalVal =
        totalVal +
        this.myCoins[i].ammount *
          this.findItemById(this.myCoins[i].id, this.currencies).USD
            .price;
    }
    return totalVal;
  }
  sellCoin(id: number, ammount: number) {
    if (confirm("Are You Sure?")) {
      this.currencyService.sellCoin(id, ammount);
      const coinProp = this.findItemById(id, this.coinProps);
      coinProp.beingSold = 0;
      this.toggleCoinHide(coinProp);
    }
  }

  private findItemById(id: number, inArr: Array<any>) {
    return inArr[this.currencyService.findItemPos(id, inArr)];
  }

  toggleCoinHide(coinProp: CoinProp) {
    coinProp.hide = !coinProp.hide;
  }
}
