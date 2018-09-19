import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { HomeComponent } from "./components/home/home.component";
import { CurrenciesComponent } from "./components/currencies/currencies.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { MycoinsComponent } from "./components/mycoins/mycoins.component";
import { CurrencyGraphsComponent } from "./components/currency-graphs/currency-graphs.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { LoginComponent } from "./auth/login/login.component";
import { AuthGuard } from "./auth/auth-guard";

const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "", component: CurrenciesComponent},
  { path: "mycoins", component: MycoinsComponent, canActivate: [AuthGuard] },
  { path: "graphs", component: CurrencyGraphsComponent },
  { path: "signup", component: SignupComponent },
  { path: "login", component: LoginComponent },
  { path: "**", component: NotFoundComponent }
];
@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
