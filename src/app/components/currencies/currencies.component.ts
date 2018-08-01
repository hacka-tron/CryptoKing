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

  constructor(
    private currencyService: CurrencyService
  ) { }

  ngOnInit() {
    this.currencyService.getCurrencies().subscribe(currencies => {
      this.currencies = currencies;
      this.currencies.forEach((cur, index) =>{
        cur.hide = true;
      })
    })
    
  }
  toggleHide(currency){
    currency.hide = !currency.hide;
  }
}
