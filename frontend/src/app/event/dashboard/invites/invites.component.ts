import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Event } from 'src/app/models/event.model';

@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.scss']
})
export class InvitesComponent implements OnInit {
  @Input() event: Event;

  constructor() { }

  ngOnInit() {
  }

  get invitedUsers(): User[] {
    return this.event.invites.map(invite => invite.user);
  }

}
