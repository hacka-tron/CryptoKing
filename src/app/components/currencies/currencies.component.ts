import { Component, OnInit, Input } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';

import { Currency } from '../models/Currencies';
import { Coin } from '../models/Coins';


@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',

  styleUrls: ['./currencies.component.css']
})
export class CurrenciesComponent implements OnInit {
  //@Input() isFavorite: boolean;
  currencies: Currency[];
  myCoins: Coin[] = [];
  favNum: number = 0;
  curNum: number = 0;


  constructor(
    private currencyService: CurrencyService
  ) { }

  ngOnInit() {
    this.currencyService.getCurrencies().subscribe(currencies => {
      this.currencies = currencies["data"];
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
      })
      this.currencies.forEach((cur, index) => {
        cur.hide = true;
        cur.isFavorite = false;
        cur.toBuy = false;
        cur.beingBought = 0;
      })
    })
    this.myCoins.push({
      id: 0,
      ammount: 1000,
      hide: true,
      beingSold: 0
    })
  }
  findTotalValue() {
    var totalVal = 0;
    for (var i = 0; i < this.myCoins.length; i++) {
      totalVal = totalVal + this.myCoins[i].ammount * this.findItemById(this.myCoins[i].id, this.currencies).quotes.USD.price;
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

  buyCoin(id: number, ammount: number, value: number) {
    if (confirm("Are You Sure?")) {
      const curItem = this.findItemById(id, this.myCoins);
      if (curItem == null) {
        this.myCoins.push({ id, ammount, hide: true, beingSold: 0});
      } else {
        curItem.ammount = curItem.ammount + ammount;
      }
      this.myCoins[0].ammount = this.myCoins[0].ammount - value;
      const cur = this.findItemById(id, this.currencies);
      cur.beingBought = 0;
      this.toggleToBuy(cur);
    }
  }
  sellCoin(id: number, ammount: number, value: number) {
    if (confirm("Are You Sure?")) {
      const curItem = this.findItemById(id, this.myCoins);
      curItem.ammount = curItem.ammount - ammount;
      this.myCoins[0].ammount = this.myCoins[0].ammount + value;
      curItem.beingSold = 0;
      this.toggleCoinHide(curItem);
    }
  }
  toggleCoinHide(coin: Coin){
    coin.hide = !coin.hide;
  }
  toggleCurrencyHide(currency: Currency) {
    if (currency.toBuy) {
      this.toggleToBuy(currency);
    }
    currency.hide = !currency.hide;
  }

  toggleToBuy(currency: Currency) {
    if (!currency.hide) {
      this.toggleCurrencyHide(currency);
    }
    currency.toBuy = !currency.toBuy;
  }

  toggleFavorites(currency: Currency) {
    currency.isFavorite = !currency.isFavorite;
    if (currency.isFavorite) {
      this.favNum++;
    } else {
      this.favNum--;
    }
  }
}

