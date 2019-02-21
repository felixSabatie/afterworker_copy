import { Component, OnInit } from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "../ngrx/app.state";
import {User} from "../models/user.model";
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user: User = undefined;
  faSignOutAlt = faSignOutAlt;

  constructor(private store: Store<AppState>) {
    store.select('user').subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit() {
  }

}
