import { Component, OnInit } from '@angular/core';
import {EventService} from "../../shared-services/event.service";
import {ActivatedRoute} from "@angular/router";
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  event: Event;
  fetchingEvent = true;

  constructor(private eventService: EventService, private route: ActivatedRoute) {
    this.eventService.getEvent(this.route.snapshot.params['hash']).subscribe((event: Event) => {
      this.event = event;
      this.fetchingEvent = false;
    });
  }

  ngOnInit() {
  }

}
