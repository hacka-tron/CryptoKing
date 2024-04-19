import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  errorMessage: string = "";

  private errorMessageUpdated = new Subject<string>();

  constructor() { }

  addErrors(errorMessage: string){
    this.errorMessage = errorMessage
    this.errorMessageUpdated.next(this.errorMessage);
  }

  postErrorMessages(){
    return this.errorMessageUpdated.asObservable();
  }
}
