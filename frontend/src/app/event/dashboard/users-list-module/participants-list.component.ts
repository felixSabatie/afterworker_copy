import {Component, Input, OnInit} from '@angular/core';
import {Event} from '../../../models/event.model';

@Component({
  selector: 'app-participants-list',
  templateUrl: './participants-list.component.html',
  styleUrls: ['./participants-list.component.scss']
})
export class ParticipantsListComponent implements OnInit {
  @Input() event: Event;

  constructor() { }

  ngOnInit() {
  }

}
