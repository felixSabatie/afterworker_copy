import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { faUser, faKey } from "@fortawesome/free-solid-svg-icons";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AuthService],
})
export class LoginComponent implements OnInit {
  userInfos: FormGroup;
  submitted = false;
  faUser = faUser;
  faKey = faKey;

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
    this.submitted = true;
    if(!this.userInfos.invalid) {
      this.authService.getToken(this.userInfos.value)
        .subscribe(response => {
          console.log(response)
        }, err => {
          console.error(err)
        });
    }
  }

}
