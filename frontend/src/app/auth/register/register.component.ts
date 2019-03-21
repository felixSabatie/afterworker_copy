import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {faAt, faKey, faUser} from '@fortawesome/free-solid-svg-icons';
import {AuthService} from '../auth.service';
import {finalize} from 'rxjs/operators';
import {UserService} from '../../shared-services/user.service';
import {User} from '../../models/user.model';
import {Store} from '@ngrx/store';
import {AppState} from '../../ngrx/app.state';
import {Router} from '@angular/router';
import * as TokenActions from '../../ngrx/actions/token.actions';
import * as UserActions from '../../ngrx/actions/user.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private userService: UserService,
              private store: Store<AppState>,
              private router: Router,
  ) {
    store.select('token').subscribe(token => {
      if (token !== undefined) {
        this.getUserAndRedirect();
      }
    });
    this.buildForm();
  }
  userInfos: FormGroup;
  submitted = false;
  errors: string[] = [];
  faUser = faUser;
  faKey = faKey;
  faAt = faAt;
  waitingForResponse = false;
  alreadyTakenErrors = false;

  static checkPasswordConfirmation(formGroup: FormGroup) {
    const valid = formGroup.value.password === formGroup.value.password_confirmation;
    if (!valid) {
      formGroup.controls.password_confirmation.setErrors({confirm: true});
    }
    return valid;
  }

  ngOnInit() {
  }

  buildForm() {
    this.userInfos = this.fb.group({
      email: ['', Validators.pattern(/^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i)],
      username: [''],
      password: ['', Validators.minLength(6)],
      password_confirmation: [''],
    }, { validator: RegisterComponent.checkPasswordConfirmation });

    this.userInfos.valueChanges.subscribe(data => {
      if (this.alreadyTakenErrors) {
        this.userInfos.controls.username.setErrors(null);
        this.userInfos.controls.email.setErrors(null);
        this.alreadyTakenErrors = false;
      }
    });
  }

  submitForm() {
    if (!this.waitingForResponse) {
      this.errors = [];
      this.submitted = true;

      if (this.userInfos.valid) {
        this.waitingForResponse = true;
        const userInfosValue = this.userInfos.value;
        this.userService.register(userInfosValue)
          .pipe(finalize(() => {
            this.waitingForResponse = false;
          }))
          .subscribe(user => {
            this.storeUserAndGetToken(user, userInfosValue);
          }, err => {
            if (err.status === 409 && err.error.errors) {
              this.alreadyTakenErrors = true;
              if (err.error.errors.email) {
                this.userInfos.controls.email.setErrors({taken: true});
              }
              if (err.error.errors.username) {
                this.userInfos.controls.username.setErrors({taken: true});
              }
            } else if (err.status === 422) {
              if (err.error.password_confirmation) {
                this.errors.push('The passwords don\'t match');
              } else {
                this.errors.push('Fill the required fields');
              }
            }
          });
      }
    }
  }

  storeUserAndGetToken(user: User, userInfosValue: object) {
    this.store.dispatch(new UserActions.SetUser(user));

    this.authService.getToken(userInfosValue)
      .subscribe(response => {
        this.storeTokenAndRedirect(response.jwt);
      });
  }

  storeTokenAndRedirect(token: string) {
    this.store.dispatch(new TokenActions.SetToken(token));
    this.router.navigate(['home']);
  }

  getUserAndRedirect() {
    this.userService.getCurrentUser().subscribe((user: User) => {
      this.store.dispatch(new UserActions.SetUser(user));
      this.router.navigate(['home']);
    });
  }
}
