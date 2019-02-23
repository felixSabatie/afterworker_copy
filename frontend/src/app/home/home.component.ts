import { Component, OnInit } from '@angular/core';
import {Event} from "../models/event.model";
import {AppState} from "../ngrx/app.state";
import {Store} from '@ngrx/store';
import {Router} from "@angular/router";
import {EventService} from "../shared-services/event.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  events: Event[];

  constructor(private store: Store<AppState>, private router: Router, private eventService: EventService) {
    // TODO change to an http 401 event catcher
    store.select('user').subscribe(user => {
      if(user === undefined) {
        router.navigate(['login']);
      }
    });

    eventService.getEvents().subscribe(events => {
      console.log(events);
      this.events = events;
    });
  }

  ngOnInit() {
  }

}
