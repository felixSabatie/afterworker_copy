import { Component, OnInit } from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../ngrx/app.state';
import {User} from '../models/user.model';
import { faSignOutAlt, faBell } from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';
import * as GlobalActions from '../ngrx/actions/global.actions';
import { Invite } from '../models/invite.model';
import { InvitesService } from '../shared-services/invites.service';
import * as UserActions from '../ngrx/actions/user.actions';

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

  constructor(private store: Store<AppState>, private router: Router, private invitesService: InvitesService) {
    store.select('user').subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit() {
  }

  private toggleShowAccountDropdown() {
    const wasOpen = this.showAccountDropDown;
    this.closeAllDropdowns();
    if (!wasOpen) {
      this.showAccountDropDown = true;
    }
    // TODO click outside to close : https://github.com/ng-bootstrap/ng-bootstrap/issues/933#issuecomment-272656499
  }

  private toggleShowNotificationsDropdown() {
    const wasOpen = this.showNotificationsDropDown;
    this.closeAllDropdowns();
    if (!wasOpen) {
      this.showNotificationsDropDown = true;
    }
    // TODO click outside to close : https://github.com/ng-bootstrap/ng-bootstrap/issues/933#issuecomment-272656499
  }

  private closeAllDropdowns() {
    this.showAccountDropDown = false;
    this.showNotificationsDropDown = false;
  }

  private logout() {
    this.store.dispatch(new GlobalActions.ResetAll());
    this.showAccountDropDown = false;
    this.router.navigate(['login']);
  }

  private accept(invite: Invite) {
    this.invitesService.accept(invite).subscribe(() => {
      this.closeAllDropdowns();
      this.removeInviteFromStore(invite);
      this.router.navigate(['events/' + invite.event.event_hash]);
    });
  }

  private refuse(invite: Invite) {
    this.invitesService.refuse(invite).subscribe(() => {
      this.closeAllDropdowns();
      this.removeInviteFromStore(invite);
    });
  }

  removeInviteFromStore(invite: Invite) {
    this.store.dispatch(new UserActions.SetUser({...this.user, invites: this.user.invites.filter(i => i.id !== invite.id)}));
  }

}
