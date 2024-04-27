import { Component, Input, Output, EventEmitter} from '@angular/core';
import { CurrencyProp } from "../models/CurrencyProps";

import { CurrencyService } from 'app/services/currency.service';

@Component({
  selector: 'currencies-list',
  templateUrl: './currencies-list.component.html',
  styleUrl: './currencies-list.component.css'
})
export class CurrenciesListComponent {
  @Input() currencyProps: CurrencyProp[] = [];
  @Input() userIsAuthenticated: boolean = false;

  @Input() curWalletId: string;
  @Input() dollarAmmount: number;

  @Output() favoritePropAdded = new EventEmitter<CurrencyProp>();
  @Output() favoritePropRemoved = new EventEmitter<CurrencyProp>();

  constructor(
    private currencyService: CurrencyService,
  ) { }
    

  buyCoin(ammount: number, coinId: number, walletId: string) {
    if (confirm("Are You Sure?")) {
      this.currencyService.buyCoin(ammount, coinId, walletId);
      console.log('coin purchased.');
      const curProp = this.currencyProps.find(curProp => curProp.currency.id == coinId);
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
      this.favoritePropAdded.emit(currencyProp);
    } else {
      this.favoritePropRemoved.emit(currencyProp);
    }
  }
}
