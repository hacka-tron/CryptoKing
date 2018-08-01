import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';

import { Currency } from '../models/Currencies';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css']
})
export class CurrenciesComponent implements OnInit {
  currencies: Currency[];
  favorites: Currency[] = [];

  constructor(
    private currencyService: CurrencyService
  ) { }

  ngOnInit() {
    this.currencyService.getCurrencies().subscribe(currencies => {
      this.currencies = currencies;
      this.currencies.forEach((cur, index) =>{
        cur.hide = true;
        cur.isFavorite = false;
      })
    })  
  }

  toggleHide(currency: Currency){
    currency.hide = !currency.hide;
  }

  addToFavorites(currency: Currency){
    currency.isFavorite = true;
    this.favorites.unshift(currency);
  }
  removeFromFavorites(currency: Currency){
    currency.isFavorite = false;
    this.favorites.forEach((cur, index) => {
      if(currency.id ==cur.id){
        this.favorites.splice(index,1);
      }
    });
  }
}
