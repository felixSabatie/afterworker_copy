import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EventService} from "../../shared-services/event.service";
import {PlacePollOption} from "../../models/place-poll-option.model";
import {DatePollOption} from "../../models/date-poll-option.model";

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {
  eventInfos: FormGroup;
  submitted = false;
  waitingForResponse = false;
  errors: string[] = [];
  startAt = new Date();

  constructor(private fb: FormBuilder, private eventService: EventService) {
    this.startAt.setHours(this.startAt.getHours() + 1);
    this.startAt.setMinutes(0);
    this.startAt.setSeconds(0);
    this.eventInfos = this.fb.group({
      name: [''],
      has_date_poll: [true],
      has_place_poll: [true],
      is_open_to_dates: [true],
      is_open_to_places: [true],
      place: [''],
      date: [''],
    });
  }

  ngOnInit() {
  }

  submitForm() {
    if(!this.waitingForResponse) {
      this.errors = [];
      this.submitted = true;

      if(this.eventInfos.valid) {
        this.waitingForResponse = true;
        const eventInfosValue = this.eventInfos.value;
        const place = {name: this.eventInfos.value.place} as PlacePollOption;
        const date = {date: this.eventInfos.value.date} as DatePollOption;
        this.eventService.createEvent(eventInfosValue, place, date).subscribe(event => {
          console.log(event);
          // TODO
        }, err => {
          this.errors.push('There has been a problem...');
          this.waitingForResponse = false;
        });
      }
    }
  }

}
