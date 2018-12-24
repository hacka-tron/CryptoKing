import { Component, OnInit } from "@angular/core";
import { CurrencyService } from "../../services/currency.service";

@Component({
  selector: "app-not-found",
  templateUrl: "./not-found.component.html",
  styleUrls: ["./not-found.component.css"]
})
export class NotFoundComponent implements OnInit {
  constructor(private currencyService: CurrencyService) {}

  ngOnInit() {}
  getWallets(){
    this.currencyService.getWallets();
  }
}
