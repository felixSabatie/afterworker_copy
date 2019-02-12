import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {faKey, faAt} from "@fortawesome/free-solid-svg-icons";
import {AuthService} from "../auth.service";
import {finalize} from "rxjs/operators";
import {Router} from "@angular/router";
import {Store} from '@ngrx/store';
import {AppState} from "../../ngrx/app.state";
import * as UserActions from '../../ngrx/actions/user.actions';
import {User} from "../../models/user.model";

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
  faKey = faKey;
  faAt = faAt;
  waitingForResponse = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private store: Store<AppState>) {
    this.buildForm();
  }

  ngOnInit() {
  }

  buildForm() {
    this.userInfos = this.fb.group({
      email: ['', Validators.pattern(/\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i)],
      password: [''],
    });
  }

  submitForm() {
    if(!this.waitingForResponse) {
      this.errors = [];
      this.submitted = true;
      this.waitingForResponse = true;
      if(!this.userInfos.invalid) {
        this.authService.getToken(this.userInfos.value)
          .pipe(finalize(() => {
            this.waitingForResponse = false;
          }))
          .subscribe(response => {
            const token = response.jwt;
            this.storeTokenAndGetUser(token);
          }, err => {
            if(err.status === 404) {
              this.errors.push('Your informations are incorrect, please try again');
            } else if (err.status === 422){
              this.errors.push('Fill the required fields');
            }
          });
      }
    }
  }

  storeTokenAndGetUser(token: string) {

  }

  storeAndRedirect(user: User) {
    this.store.dispatch(new UserActions.SetUser({username: 'billy', email: 'aze@aze.fr', avatar_link: ''}));
    this.router.navigate(['home']);
  }

}
