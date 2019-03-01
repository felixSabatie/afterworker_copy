import { Component, OnInit } from '@angular/core';
import {Event} from "../models/event.model";
import {AppState} from "../ngrx/app.state";
import {Store} from '@ngrx/store';
import {Router} from "@angular/router";
import {EventService} from "../shared-services/event.service";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  hasEvents: boolean;
  upcomingEvents: Event[] = [];
  pastEvents: Event[] = [];
  fetchingEvents = true;
  showCreateModal = false;

  faPlus = faPlus;

  constructor(private store: Store<AppState>, private router: Router, private eventService: EventService) {
    // TODO change to an http 401 event catcher
    store.select('user').subscribe(user => {
      if(user === undefined) {
        router.navigate(['login']);
      }
    });

    eventService.getEvents().subscribe(events => {
      this.fetchingEvents = false;
      this.hasEvents = events.length > 0;
      events.forEach(event => {
        if (event.chosen_date === undefined || new Date(event.chosen_date.date) > new Date()) {
          this.upcomingEvents.push(event);
        } else {
          this.pastEvents.push(event);
        }
      });
    });
  }

  ngOnInit() {
  }

  openCreateModal() {
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

}
