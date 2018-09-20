import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {}

  onSignup(form: NgForm) {
    if (form.value.password == form.value.confirmPassword) {
      this.authService.createUser(
        form.value.email,
        form.value.userName,
        form.value.password
      );
    }
  }
}
