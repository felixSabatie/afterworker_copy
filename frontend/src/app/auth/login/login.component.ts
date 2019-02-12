import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { faUser, faKey } from "@fortawesome/free-solid-svg-icons";
import {AuthService} from "../auth.service";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AuthService],
})
export class LoginComponent implements OnInit {
  userInfos: FormGroup;
  submitted = false;
  errors: string[] = [];
  faUser = faUser;
  faKey = faKey;
  waitingForResponse = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.buildForm();
  }

  ngOnInit() {
  }

  buildForm() {
    this.userInfos = this.fb.group({
      email: ['', Validators.email],
      password: [''],
    });
  }

  submitForm() {
    this.errors = [];
    this.submitted = true;
    this.waitingForResponse = true;
    if(!this.userInfos.invalid) {
      this.authService.getToken(this.userInfos.value)
        .pipe(finalize(() => {
            this.waitingForResponse = false;
        }))
        .subscribe(response => {
          console.log(response)
        }, err => {
          // this.userInfos.controls.email.setErrors({email: true});    TODO remove example
          if(err.status === 404) {
            this.errors.push('Your informations are incorrect, please try again');
          } else if (err.status === 422){
            this.errors.push('Fill the required fields');
          }
        });
    }
  }

}
