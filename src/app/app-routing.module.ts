import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CurrenciesComponent } from "./components/currencies/currencies.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { MycoinsComponent } from "./components/mycoins/mycoins.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { LoginComponent } from "./auth/login/login.component";
import { AuthGuard } from "./auth/auth-guard";
import { LeaderBoardComponent } from "./components/leader-board/leader-board.component";
import { AboutComponent } from "./components/about/about.component";

const routes: Routes = [
  { path: "", component: CurrenciesComponent },
  { path: "mycoins", component: MycoinsComponent, canActivate: [AuthGuard] },
  { path: "signup", component: SignupComponent },
  { path: "login", component: LoginComponent },
  { path: "leaderboard", component: LeaderBoardComponent },
  { path: "about", component: AboutComponent},
  { path: "**", component: NotFoundComponent }
];
@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
