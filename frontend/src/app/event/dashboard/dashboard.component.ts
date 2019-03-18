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
  notFound = false;
  currentUser: User;

  navItems = [faMapMarkerAlt, faCalendarAlt, faUsers];

  currentSwiperIndex = 0;

  constructor(private eventService: EventService, private route: ActivatedRoute, private store: Store<AppState>) {
    store.select('user').subscribe(user => {
      this.currentUser = user;
      this.fecthingUser = false;
    });
    this.eventService.getEvent(this.route.snapshot.params['hash']).subscribe((event: Event) => {
      this.event = event;
      this.fetchingEvent = false;
    }, err => {
      if(err.status && err.status === 404) {
        this.notFound = true;
        this.fetchingEvent = false;
      }
    });
  }

  ngOnInit() {
  }

  get isAdmin() {
    return this.event.creator.id === this.currentUser.id;
  }

  swiperIndexChanged(newIndex: number) {
    this.currentSwiperIndex = newIndex;
  }

  choosePlace(placeId: number) {
    console.log('chose place ' + placeId);
  }

  chooseDate(dateId: number) {
    console.log('chose date ' + dateId);
  }

}
