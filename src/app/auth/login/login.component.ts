import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;

  private authStatusSub: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListner().subscribe( authstatus =>{
      this.isLoading = false;
    });
  }

  onLogin(form: NgForm) {
    if (form.invalid){
      return;
    }
    this.authService.login(form.value.email, form.value.password);
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
