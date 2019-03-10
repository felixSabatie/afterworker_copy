import { Component, OnInit } from '@angular/core';
import {EventService} from "../../shared-services/event.service";
import {ActivatedRoute} from "@angular/router";
import { Event } from '../../models/event.model';
import {VotingItem} from "../../models/voting-item.model";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  event: Event;
  fetchingEvent = true;
  testVotingItems: VotingItem[] = [];

  constructor(private eventService: EventService, private route: ActivatedRoute) {
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

}
