import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";

import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { MatDialog } from "@angular/material";
import { ErrorComponent } from "./components/error/error.component";
import { ErrorService } from "./services/error.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog, private errorService: ErrorService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "An unkown error occured";
        if(error.error.message) {
          errorMessage = error.error.message;
        }

        this.errorService.addErrors(errorMessage);
        return throwError(error);

      })
    );
  }
}
