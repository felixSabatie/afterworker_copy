import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {User} from "../models/user.model";
import {AppState} from "../ngrx/app.state";
import {Store} from '@ngrx/store';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: Observable<User>;

  constructor(private store: Store<AppState>, private router: Router) {
    // TODO change to an http 401 event catcher
    this.user = store.select('user');
    this.user.subscribe(user => {
      if(user === undefined) {
        router.navigate(['login']);
      }
    });
  }

  ngOnInit() {
  }

}
