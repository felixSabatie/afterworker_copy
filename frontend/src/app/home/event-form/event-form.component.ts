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

  constructor(private fb: FormBuilder) {
    this.eventInfos = this.fb.group({
      name: [''],
      has_date_poll: [true],
      has_place_poll: [true],
      is_open_to_dates: [true],
      is_open_to_places: [true],
      place: ['']
    });

    // TODO integrate https://www.npmjs.com/package/ng-pick-datetime
  }

  ngOnInit() {
  }

  submitForm() {
    this.submitted = true;
    this.waitingForResponse = true;
    console.log(this.eventInfos.value);
  }

}
