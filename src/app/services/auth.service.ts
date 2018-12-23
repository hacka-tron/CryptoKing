import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { AuthData } from "../auth/auth-data";
import { environment } from "../../environments/environment";

const BACKEND_USER_URL = environment.backendApiUrl + "/user";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private userName: string;
  private tokenTimer: any;
  private userId: string;
  private activeWallet: string;
  private userNameListner = new Subject<string>();
  private authStatusListner = new Subject<boolean>();
  private activeWalletListener = new Subject<string>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  //This is used because "getUserNameListner()" isn't orignally trigered
  getUserName() {
    return this.userName;
  }

  //This is used because "getAuthStatusListner()" isn't orignally trigered
  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getActiveWallet() {
    return this.activeWallet;
  }
  //Shows whether user is currently authenticated
  getAuthStatusListner() {
    return this.authStatusListner.asObservable();
  }

  getUserNameListner() {
    return this.userNameListner.asObservable();
  }

  getActiveWalletListner(){
    return this.activeWalletListener.asObservable();
  }

  createUser(email: string, userName: string, password: string) {
    const authData: AuthData = {
      email: email,
      userName: userName,
      password: password
    };
    this.http.post(BACKEND_USER_URL + "/signup", authData).subscribe(
      response => {
        this.login(email, password);
      },
      error => {
        this.authStatusListner.next(false);
        this.userNameListner.next(null);
      }
    );
  }

  login(email: string, password: string) {
    const authData = { email: email, password: password };
    this.http
      .post<{
        token: string;
        expiresIn: number;
        userName: string;
        userId: string;
        activeWallet: string;
      }>(BACKEND_USER_URL + "/login", authData)
      .subscribe(
        response => {
          this.token = response.token;
          if (this.token) {
            //Finds how long token is valid for, then timer is set
            const expiresInDuaration = response.expiresIn;
            this.setAuthTimer(expiresInDuaration);
            this.isAuthenticated = true;
            this.userName = response.userName;
            this.userId = response.userId;
            this.activeWallet = response.activeWallet;
            this.authStatusListner.next(true);
            this.userNameListner.next(this.userName);
            this.activeWalletListener.next(this.activeWallet);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuaration * 1000
            );
            this.saveAuthData(
              this.token,
              expirationDate,
              this.userName,
              this.userId,
              this.activeWallet
            );
            this.router.navigate(["/"]);
          }
        },
        error => {
          this.authStatusListner.next(false);
          this.userNameListner.next(null);
        }
      );
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.userName = null;
    this.userId = null;
    this.activeWallet = null;
    this.authStatusListner.next(this.isAuthenticated);
    this.userNameListner.next(this.userName);
    this.activeWalletListener.next(null);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  //This is called whenever the app is started to see whether the token in local storage is still valid
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userName = authInformation.userName;
      this.userId = authInformation.userId;
      this.activeWallet = authInformation.activeWallet;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListner.next(this.isAuthenticated);
      this.userNameListner.next(this.userName);
      this.activeWalletListener.next(this.activeWallet);
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  //This information should be saved locally so logins can persist for a prolonged period of time
  private saveAuthData(
    token: string,
    expirateData: Date,
    userName: string,
    userId: string,
    activeWallet: string
  ) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirateData.toISOString());
    localStorage.setItem("userName", userName);
    localStorage.setItem("userId", userId);
    localStorage.setItem("activeWallet", activeWallet);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("activeWallet");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const activeWallet = localStorage.getItem("activeWallet")
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userName: userName,
      userId: userId,
      activeWallet: activeWallet
    };
  }
}
