import { Component, OnInit, TemplateRef, OnDestroy } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";

import { CurrencyService } from "../../services/currency.service";

import { Currency } from "../models/Currencies";
import { Wallet } from "../models/Wallet";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "app-mycoins",
  templateUrl: "./mycoins.component.html",
  styleUrls: ["./mycoins.component.css"]
})
export class MycoinsComponent implements OnInit, OnDestroy {
  MINIMUM_DISPLAY_VALUE: number = 1;
  curInput: number = 0;
  sellingCoin: BsModalRef;
  activeWallet: string;
  wallets: Wallet[] = [];
  currencies: Currency[];
  isLoading: boolean = false;

  private walletListenerSubs: Subscription;
  private currencyListenerSubs: Subscription;

  constructor(
    private currencyService: CurrencyService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.currencyService.getCurrencies();
    this.currencyService.getWallets();
    this.walletListenerSubs = this.currencyService
      .getUpdatedWalletsListner()
      .subscribe(wallets => {
        this.isLoading = false;
        this.wallets = wallets;
      });
    this.currencyListenerSubs = this.currencyService
      .getUpdatedCurrenciesListner()
      .subscribe(currencies => {
        this.isLoading = false;
        this.currencies = currencies;
      });
  }

  getCoinName(id: number) {
    return this.currencyService.findItemById(id, this.currencies).name;
  }
  getCoinSymbol(id: number) {
    return this.currencyService.findItemById(id, this.currencies).symbol;
  }
  getCoinValue(id: number, ammount: number) {
    return (
      ammount * this.currencyService.findItemById(id, this.currencies).USD.price
    );
  }

  findTotalValue(walletId: string) {
    return this.currencyService.findTotalValue(walletId);
  }
  onSellCoin(form: NgForm, coinId, walletId) {
    if (confirm("Are You Sure?")) {
      this.isLoading = true;
      this.currencyService.sellCoin(form.value.ammount, coinId, walletId);
      this.sellingCoin.hide();
    }
  }

  openSellingCoin(template: TemplateRef<any>) {
    this.sellingCoin = this.modalService.show(template);
  }
  ngOnDestroy() {
    this.walletListenerSubs.unsubscribe();
    this.currencyListenerSubs.unsubscribe();
  }
}
