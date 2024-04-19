import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;

  private authStatusSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListner()
      .subscribe(authstatus => {
        this.isLoading = false;
      });
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (form.value.password == form.value.confirmPassword) {
      this.authService.createUser(
        form.value.email,
        form.value.userName,
        form.value.password
      );
    }
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
