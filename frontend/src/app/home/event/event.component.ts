import {Component, Input, OnInit} from '@angular/core';
import {Event} from "../../models/event.model";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  @Input() event: Event;
  differentYear: boolean = false;

  constructor() {
  }

  ngOnInit() {
    this.differentYear = this.event.chosen_date !== undefined
      && new Date(this.event.chosen_date.date).getFullYear() !== new Date().getFullYear();
  }

}
