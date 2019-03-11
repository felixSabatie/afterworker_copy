import { Component, OnInit } from '@angular/core';
import {EventService} from "../../shared-services/event.service";
import {ActivatedRoute} from "@angular/router";
import { Event } from '../../models/event.model';
import {VotingItem} from "../../models/voting-item.model";
import {Store} from "@ngrx/store";
import {AppState} from "../../ngrx/app.state";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  event: Event;
  fetchingEvent = true;
  fecthingUser = true;
  testVotingItems: VotingItem[] = [];
  currentUser: User;

  constructor(private eventService: EventService, private route: ActivatedRoute, private store: Store<AppState>) {
    store.select('user').subscribe(user => {
      this.currentUser = user;
      this.fecthingUser = false;
    });
    this.eventService.getEvent(this.route.snapshot.params['hash']).subscribe((event: Event) => {
      this.event = event;
      this.fetchingEvent = false;
      this.testVotingItems = this.event.place_poll_options.map(placePollOption => {
        return {
          id: placePollOption.id,
          name: placePollOption.name,
          voters: placePollOption.voters,
        }
      });
    });
  }

  ngOnInit() {
  }

  toggleVote(e: Event) {
    console.log(e);
  }

}
