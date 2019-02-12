import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {User} from "../models/user.model";
import {AppState} from "../ngrx/app.state";
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: Observable<User>;

  constructor(private store: Store<AppState>) {
    this.user = store.select('user');
  }

  ngOnInit() {
  }

}
