import { Component, OnInit } from "@angular/core";
import { Chart } from "chart.js";

import { CurrencyService } from "../../services/currency.service";

import { Currency } from "../models/Currencies";

@Component({
  selector: "app-currency-graphs",
  templateUrl: "./currency-graphs.component.html",
  styleUrls: ["./currency-graphs.component.css"]
})
export class CurrencyGraphsComponent implements OnInit {
  currencies: Currency[];
  chart: any;
  min: number;
  max: number;

  constructor(private currencyService: CurrencyService) { }

  ngOnInit() {
    this.currencyService.getCurrencies();
    this.currencyService.getUpdatedCurrenciesListner().subscribe(currencies => {
      this.currencies = currencies;
      this.min = 1;
      this.max = 11;

      this.chart = new Chart("marketCap", {
        type: "bar",
        data: {
          labels: this.currencies
            .map(cur => cur.name)
            .slice(this.min, this.max),
          datasets: [
            {
              label: "Market Cap",
              data: this.currencies
                .map(cur => cur.USD.market_cap)
                .slice(this.min, this.max),
              backgroundColor: sameColorArray(
                "rgba(0, 0, 255, 0.3)",
                this.max - this.min
              )
            },
            {
              label: "Volume 24h",
              data: this.currencies
                .map(cur => cur.USD.volume_24h)
                .slice(this.min, this.max),
              backgroundColor: sameColorArray(
                "rgba(0, 255, 0, 0.3)",
                this.max - this.min
              )
            }
          ]
        },
        options: {
          plugins: {
            tooltip: {
              callbacks: {
                title: function () {
                  return "";
                },
                label: function (context) {
                  return (
                    context.parsed.x +
                    ": $" +
                    context.parsed.y.toLocaleString()
                  );
                }
              }
            }
          },
          scales: {
            y: {
              ticks: {
                // Include a dollar sign in the ticks
                callback: function (value, index, values) {
                  return "$" + value.toLocaleString();
                }
              },
              title: {
                display: true,
                text: "Value in USD" // Add a title for the y-axis
              }
            }
          }

        }
      });
    });
  }
}

function sameColorArray(color: string, num: number) {
  var colorArr = [];
  for (var i = 0; i < num; i++) {
    colorArr[i] = color;
  }
  return colorArr;
}