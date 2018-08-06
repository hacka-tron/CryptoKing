import { Component, OnInit, Input } from '@angular/core';

import { Currency } from '../models/Currencies';

@Component({
  selector: 'app-mycoins',
  templateUrl: './mycoins.component.html',
  styleUrls: ['./mycoins.component.css']
})
export class MycoinsComponent implements OnInit {
  @Input() currencies: Currency[];

  constructor() { }

  ngOnInit() {
  }

}
