import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  userName: string;
  private authListnerSubs: Subscription;
  private userListnerSubs: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    //Certains tabs should/shouldn't appear when loged in/out
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListnerSubs = this.authService
      .getAuthStatusListner()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.userName = this.authService.getUserName();
    this.userListnerSubs = this.authService
      .getUserNameListner()
      .subscribe(userName => {
        this.userName = userName;
      });
  }

  ngOnDestroy() {
    this.authListnerSubs.unsubscribe();
    this.userListnerSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
