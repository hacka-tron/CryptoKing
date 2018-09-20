import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { CustomFormsModule } from "ng2-validation";
import { ChartModule } from "primeng/chart";

import { CurrencyService } from "./services/currency.service";

import { AppComponent } from "./app.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { CurrenciesComponent } from "./components/currencies/currencies.component";
import { AppRoutingModule } from ".//app-routing.module";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { MycoinsComponent } from "./components/mycoins/mycoins.component";
import { CurrencyGraphsComponent } from "./components/currency-graphs/currency-graphs.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";

import { AuthInterceptor } from "./auth/auth-interceptor";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CurrenciesComponent,
    NotFoundComponent,
    MycoinsComponent,
    CurrencyGraphsComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    CustomFormsModule,
    ChartModule
  ],
  providers: [
    CurrencyService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
