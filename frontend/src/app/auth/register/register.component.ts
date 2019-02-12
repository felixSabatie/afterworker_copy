import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {faAt, faKey, faUser} from "@fortawesome/free-solid-svg-icons";
import {AuthService} from "../auth.service";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  userInfos: FormGroup;
  submitted = false;
  errors: string[] = [];
  faUser = faUser;
  faKey = faKey;
  faAt = faAt;
  waitingForResponse = false;
  alreadyTakenErrors = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.buildForm();
  }

  ngOnInit() {
  }

  buildForm() {
    this.userInfos = this.fb.group({
      email: ['', Validators.pattern(/\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i)],
      username: [''],
      password: ['', Validators.minLength(6)],
      password_confirmation: [''],
    }, { validator: RegisterComponent.checkPasswordConfirmation });

    this.userInfos.valueChanges.subscribe(data => {
      if(this.alreadyTakenErrors) {
        this.userInfos.controls.username.setErrors(null);
        this.userInfos.controls.email.setErrors(null);
        this.alreadyTakenErrors = false;
      }
    });
  }

  static checkPasswordConfirmation(formGroup: FormGroup) {
    const valid = formGroup.value.password === formGroup.value.password_confirmation;
    if(!valid) {
      formGroup.controls.password_confirmation.setErrors({confirm: true})
    }
    return valid;
  }

  submitForm() {
    if(!this.waitingForResponse) {
      this.errors = [];
      this.submitted = true;

      if(this.userInfos.valid) {
        this.waitingForResponse = true;
        this.authService.register(this.userInfos.value)
          .pipe(finalize(() => {
            this.waitingForResponse = false;
          }))
          .subscribe(response => {
            console.log(response);
            // TODO get and store token and redirect
          }, err => {
            if (err.status === 409 && err.error.errors) {
              this.alreadyTakenErrors = true;
              if(err.error.errors.email) {
                this.userInfos.controls.email.setErrors({taken: true});
              }
              if(err.error.errors.username) {
                this.userInfos.controls.username.setErrors({taken: true});
              }
            } else if (err.status === 422){
              if(err.error.password_confirmation) {
                this.errors.push("The passwords don't match");
              } else {
                this.errors.push('Fill the required fields');
              }
            }
          });
      }
    }
  }
}
