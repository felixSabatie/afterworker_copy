import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

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

  constructor(private fb: FormBuilder) {
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
    this.submitted = true;
    this.waitingForResponse = true;
    console.log(this.eventInfos.value);
  }

}
