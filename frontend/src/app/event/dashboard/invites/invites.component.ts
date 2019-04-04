import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Event } from 'src/app/models/event.model';
import { UserService } from 'src/app/shared-services/user.service';
import { InvitesService } from 'src/app/shared-services/invites.service';
import { Invite } from 'src/app/models/invite.model';

@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.scss']
})
export class InvitesComponent implements OnInit {
  @Input() event: Event;
  @Output() createdInvite = new EventEmitter<Invite>();
  username = '';
  waitingForResonse = false;

  constructor(private userService: UserService, private invitesService: InvitesService) { }

  ngOnInit() {
  }

  get invitedUsers(): User[] {
    return this.event.invites.map(invite => invite.user);
  }

  createInvite() {
    this.waitingForResonse = true;
    this.userService.search(this.username).subscribe(users => {
      if (users.length > 0) {
        const user = users[0];
        this.invitesService.create(this.event, user.id).subscribe(invite => {
          this.waitingForResonse = false;
          this.createdInvite.emit(invite);
          this.username = '';
        });
      } else {
        this.waitingForResonse = false;
      }
    });
  }

}
