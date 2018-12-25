import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { CustomFormsModule } from "ng2-validation";
import { ChartModule } from "primeng/chart";
import { MatDialogModule } from "@angular/material";
import { AppRoutingModule } from ".//app-routing.module";

import { CurrencyService } from "./services/currency.service";

import { AppComponent } from "./app.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { CurrenciesComponent } from "./components/currencies/currencies.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { MycoinsComponent } from "./components/mycoins/mycoins.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { LeaderBoardComponent } from "./components/leader-board/leader-board.component";
import { CurrencyGraphsComponent } from "./components/currency-graphs/currency-graphs.component";
import { ErrorComponent } from "./components/error/error.component";

import { ErrorInterceptor } from "./error-interceptor";
import { AuthInterceptor } from "./auth/auth-interceptor";
import { AboutComponent } from './components/about/about.component';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CurrenciesComponent,
    CurrencyGraphsComponent,
    NotFoundComponent,
    MycoinsComponent,
    LoginComponent,
    SignupComponent,
    LeaderBoardComponent,
    ErrorComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    CustomFormsModule,
    ChartModule,
    MatDialogModule,
    TabsModule.forRoot()
  ],
  providers: [
    CurrencyService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule {}
