import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';

import { Currency } from '../components/models/Currencies';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}
@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  currenciesUrl: string = "https://api.coinmarketcap.com/v2/ticker/?structure=array";

  constructor(private http: HttpClient) { }
  
  getCurrencies() : Observable <Currency[]>{
    return this.http.get<Currency[]>(this.currenciesUrl);
  } 
}
