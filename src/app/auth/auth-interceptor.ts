import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from "@angular/common/http";
import { Injectable } from "@angular/core";

import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private urlsToWhiteList: string[] = ["https://api.coinmarketcap.com"];

  constructor(private authService: AuthService) {}

  //Intercepts http requests in order to add the token to them, unless that url is whitelisted
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();
    if (this.checkWhiteList(req.url)) {
      const authRequest = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + authToken)
      });
      return next.handle(authRequest);
    }
    return next.handle(req);
  }

  checkWhiteList(incomingUrl: string) {
    for (var url of this.urlsToWhiteList) {
      if (incomingUrl.indexOf(url) != -1) {
        return false;
      }
    }
    return true;
  }
}
