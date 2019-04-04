import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { InvitesService } from './shared-services/invites.service';
import { Store } from '@ngrx/store';
import { AppState } from './ngrx/app.state';
import * as UserActions from './ngrx/actions/user.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private swUpdate: SwUpdate, private router: Router, private invitesService: InvitesService, private store: Store<AppState>) {
    store.select('user').subscribe(user => {
      this.router.events.pipe(
        filter(e => e instanceof NavigationEnd)
      ).subscribe(e => {
        this.invitesService.get().subscribe(invites => {
          this.store.dispatch(new UserActions.SetUser({...user, invites}));
        });
      });
    });
  }

  ngOnInit() {
    this.swUpdate.available.subscribe(event => {
      if (confirm('A new update is available, do you want to refresh now ?')) {
        window.location.reload();
      }
    });

    this.swUpdate.checkForUpdate();
  }
}
