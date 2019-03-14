import {Component, OnInit} from '@angular/core';
import {EventService} from "../../shared-services/event.service";
import {ActivatedRoute} from "@angular/router";
import { Event } from '../../models/event.model';
import {Store} from "@ngrx/store";
import {AppState} from "../../ngrx/app.state";
import {User} from "../../models/user.model";
import { faMapMarkerAlt, faCalendarAlt, faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  event: Event;
  fetchingEvent = true;
  fecthingUser = true;
  currentUser: User;

  faMapMarkerAlt = faMapMarkerAlt;
  faCalendarAlt = faCalendarAlt;
  faUsers = faUsers;

  currentSwiperIndex = 0;

  constructor(private eventService: EventService, private route: ActivatedRoute, private store: Store<AppState>) {
    store.select('user').subscribe(user => {
      this.currentUser = user;
      this.fecthingUser = false;
    });
    this.eventService.getEvent(this.route.snapshot.params['hash']).subscribe((event: Event) => {
      this.event = event;
      this.fetchingEvent = false;
    });
  }

  ngOnInit() {
  }

  swiperIndexChanged(e: number) {
    this.currentSwiperIndex = e;
  }

}
