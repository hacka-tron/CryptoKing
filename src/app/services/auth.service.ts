import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { AuthData } from "../auth/auth-data";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private userName: string;
  private tokenTimer: any;
  private userId: string;
  private userNameListner = new Subject<string>();
  private authStatusListner = new Subject<boolean>();

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

  //Shows whether user is currently authenticated
  getAuthStatusListner() {
    return this.authStatusListner.asObservable();
  }

  getUserNameListner() {
    return this.userNameListner.asObservable();
  }

  createUser(email: string, userName: string, password: string) {
    const authData: AuthData = {
      email: email,
      userName: userName,
      password: password
    };
    this.http.post("http://localhost:3000/api/user/signup", authData).subscribe(
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
      }>("http://localhost:3000/api/user/login", authData)
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
            this.authStatusListner.next(true);
            this.userNameListner.next(this.userName);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuaration * 1000
            );
            this.saveAuthData(
              this.token,
              expirationDate,
              this.userName,
              this.userId
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
    this.authStatusListner.next(false);
    this.userNameListner.next(null);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
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
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListner.next(true);
      this.userNameListner.next(this.userName);
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
    userId: string
  ) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirateData.toISOString());
    localStorage.setItem("userName", userName);
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userName: userName,
      userId: userId
    };
  }
}
