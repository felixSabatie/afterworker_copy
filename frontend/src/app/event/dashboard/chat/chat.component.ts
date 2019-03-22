import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Event } from 'src/app/models/event.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @Input() event: Event;
  @Input() currentUser: User;

  constructor() { }

  ngOnInit() {
  }

}
