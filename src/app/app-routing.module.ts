import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { CurrenciesComponent } from './components/currencies/currencies.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MycoinsComponent } from './components/mycoins/mycoins.component';
import { CurrencyGraphsComponent } from './components/currency-graphs/currency-graphs.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'currencies', component: CurrenciesComponent },
  { path: 'mycoins', component: MycoinsComponent},
  {path: 'graphs', component: CurrencyGraphsComponent},
  { path: '**', component: NotFoundComponent }
];
@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule { }
