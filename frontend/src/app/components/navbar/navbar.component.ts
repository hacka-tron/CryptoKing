import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit, OnDestroy {
  MOBILE_WINDOW_SIZE = 992;
  private authListnerSubs: Subscription;
  private userListnerSubs: Subscription;
  userIsAuthenticated = false;
  userName: string;

  isNavbarCollapsed = true;

  constructor(private authService: AuthService) { }

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

  toggleNavbar() {
    if (window.innerWidth <= this.MOBILE_WINDOW_SIZE) {
      this.isNavbarCollapsed = !this.isNavbarCollapsed;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth >this.MOBILE_WINDOW_SIZE && !this.isNavbarCollapsed){
      this.toggleNavbar();
    }
  }
}
