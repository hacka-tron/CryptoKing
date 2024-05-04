import { Component, OnInit } from "@angular/core";
import { ErrorService } from "../../services/error.service";

@Component({
  selector: "app-error",
  templateUrl: "./error.component.html",
  styleUrls: ["./error.component.css"]
})
export class ErrorComponent implements OnInit {
  error: string = "";

  constructor(private errorService: ErrorService) {}

  ngOnInit() {
    this.errorService.postErrorMessages().subscribe(message => {
      this.error = message;
    });
  }
}
