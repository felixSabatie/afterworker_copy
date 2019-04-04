import { Component, OnInit } from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../ngrx/app.state';
import {User} from '../models/user.model';
import { faSignOutAlt, faBell } from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';
import * as GlobalActions from '../ngrx/actions/global.actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user: User = undefined;
  faSignOutAlt = faSignOutAlt;
  faBell = faBell;
  showAccountDropDown = false;
  showNotificationsDropDown = false;

  constructor(private store: Store<AppState>, private router: Router) {
    store.select('user').subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit() {
  }

  private toggleShowAccountDropdown() {
    this.showAccountDropDown = !this.showAccountDropDown;
    // TODO click outside to close : https://github.com/ng-bootstrap/ng-bootstrap/issues/933#issuecomment-272656499
  }

  private toggleShowNotificationsDropdown() {
    this.showNotificationsDropDown = !this.showNotificationsDropDown;
    // TODO click outside to close : https://github.com/ng-bootstrap/ng-bootstrap/issues/933#issuecomment-272656499
  }

  private logout() {
    this.store.dispatch(new GlobalActions.ResetAll());
    this.showAccountDropDown = false;
    this.router.navigate(['login']);
  }

}
