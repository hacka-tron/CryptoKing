import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import {ChartModule} from 'primeng/chart';

import {CurrencyService} from './services/currency.service';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CurrenciesComponent } from './components/currencies/currencies.component';
import { AppRoutingModule } from './/app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MycoinsComponent } from './components/mycoins/mycoins.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CurrenciesComponent,
    HomeComponent,
    NotFoundComponent,
    MycoinsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    CustomFormsModule,
    ChartModule 
  ],
  providers: [CurrencyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
