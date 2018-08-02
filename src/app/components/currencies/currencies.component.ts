import { Component, OnInit, Input } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';

import { Currency } from '../models/Currencies';


@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  
  styleUrls: ['./currencies.component.css']
})
export class CurrenciesComponent implements OnInit {
  //@Input() isFavorite: boolean;
  currencies: Currency[];
  favNum: number = 0;

  constructor(
    private currencyService: CurrencyService
  ) { }

  ngOnInit() {
    this.currencyService.getCurrencies().subscribe(currencies => {
      this.currencies = currencies;
      this.currencies.forEach((cur, index) => {
        cur.hide = true;
        cur.isFavorite = false;
        cur.toBuy = false;
      })
    })
  }

  toggleHide(currency: Currency) {
    if(currency.toBuy){
      this.toggleToBuy(currency);
    }
    currency.hide = !currency.hide;
  }

  toggleToBuy(currency: Currency) {
    if(!currency.hide){
      this.toggleHide(currency);
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

