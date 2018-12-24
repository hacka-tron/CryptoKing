import { Component, OnInit } from "@angular/core";

import { CurrencyService } from "../../services/currency.service";

import { Currency } from "../models/Currencies";
import { Wallet } from "../models/Wallet";

@Component({
  selector: "app-mycoins",
  templateUrl: "./mycoins.component.html",
  styleUrls: ["./mycoins.component.css"]
})
export class MycoinsComponent implements OnInit {
  activeWallet: string;
  wallets: Wallet[] = [];
  currencies: Currency[];
  constructor(private currencyService: CurrencyService) {}

  ngOnInit() {
    this.currencyService.getCurrencies();
    this.currencyService.getWallets();
    this.currencyService.getUpdatedWalletsListner().subscribe(wallets=> {
      this.wallets = wallets;
    });
    this.currencyService.getUpdatedCurrenciesListner().subscribe(currencies => {
      this.currencies = currencies;
    });
  }
  findTotalValue(walletId: string) {
    return this.currencyService.findTotalValue(walletId);
  }
  sellCoin(id: number, ammount: number) {
    if (confirm("Are You Sure?")) {
      this.currencyService.sellCoin(id, ammount);
      //const coinProp = this.findItemById(id, this.coinProps);
      //coinProp.beingSold = 0;
      //this.toggleCoinHide(coinProp);
    }
  }

  /*
  toggleCoinHide(coinProp: CoinProp) {
    coinProp.hide = !coinProp.hide;
  }
  */
}
