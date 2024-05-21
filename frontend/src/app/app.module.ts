import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { ChartModule } from "primeng/chart";
import { MatDialogModule } from "@angular/material/dialog";
import { AppRoutingModule } from "./app-routing.module";
import {MatExpansionModule} from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { CurrencyService } from "./services/currency.service";
import { CustomRouteReuseStrategy } from "./custom-route-reuse-strategy";
import { RouterModule, RouteReuseStrategy } from '@angular/router';

import { AppComponent } from "./app.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { CurrenciesComponent } from "./components/currencies/currencies.component";
import { CurrenciesListComponent } from "./components/currencies-list/currencies-list.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { MycoinsComponent } from "./components/mycoins/mycoins.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { LeaderBoardComponent } from "./components/leader-board/leader-board.component";
import { CurrencyGraphsComponent } from "./components/currency-graphs/currency-graphs.component";
import { ErrorComponent } from "./components/error/error.component";

import { ErrorInterceptor } from "./error-interceptor";
import { AuthInterceptor } from "./auth/auth-interceptor";
import { AboutComponent } from "./components/about/about.component";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ModalModule } from "ngx-bootstrap/modal";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CurrenciesComponent,
    CurrenciesListComponent,
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
    ChartModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    RouterModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    TabsModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [
    CurrencyService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
