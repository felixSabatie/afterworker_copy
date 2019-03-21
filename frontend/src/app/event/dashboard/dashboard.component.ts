import {Component, OnInit} from '@angular/core';
import {EventService} from '../../shared-services/event.service';
import {ActivatedRoute} from '@angular/router';
import { Event } from '../../models/event.model';
import {Store} from '@ngrx/store';
import {AppState} from '../../ngrx/app.state';
import {User} from '../../models/user.model';
import { faMapMarkerAlt, faCalendarAlt, faUsers } from '@fortawesome/free-solid-svg-icons';
import { PlacePollService } from './place-poll/place-poll.service';
import { DatePollService } from './date-poll/date-poll.service';
import { PlacePollOption } from 'src/app/models/place-poll-option.model';
import { DatePollOption } from 'src/app/models/date-poll-option.model';

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

  constructor(private eventService: EventService, private placePollService: PlacePollService, private datePollService: DatePollService,
              private route: ActivatedRoute, private store: Store<AppState>) {
    store.select('user').subscribe(user => {
      this.currentUser = user;
      this.fecthingUser = false;
    });
    this.eventService.getEvent(this.route.snapshot.params.hash).subscribe((event: Event) => {
      this.event = event;
      this.fetchingEvent = false;
    }, err => {
      if (err.status && err.status === 404) {
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
    this.placePollService.choosePlace(this.event, placeId).subscribe(() => {
      const chosenPlace = this.event.place_poll_options.find(placePollOption => placePollOption.id === placeId);
      this.event.chosen_place = chosenPlace;
    }, err => {
      console.error(err);
    });
  }

  deleteChosenPlace() {
    this.placePollService.deleteChosenPlace(this.event).subscribe(() => {
      this.event.chosen_place = undefined;
    }, err => {
      console.error(err);
    });
  }

  addPlace(place: PlacePollOption) {
    this.event.place_poll_options.push(place);
  }

  chooseDate(dateId: number) {
    this.datePollService.chooseDate(this.event, dateId).subscribe(() => {
      const chosenDate = this.event.date_poll_options.find(datePollOption => datePollOption.id === dateId);
      this.event.chosen_date = chosenDate;
    }, err => {
      console.error(err);
    });
  }

  deleteChosenDate() {
    this.datePollService.deleteChosenDate(this.event).subscribe(() => {
      this.event.chosen_date = undefined;
    }, err => {
      console.error(err);
    });
  }

  addDate(date: DatePollOption) {
    this.event.date_poll_options.push(date);
  }

}
