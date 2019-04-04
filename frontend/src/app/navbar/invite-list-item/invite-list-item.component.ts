import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Invite } from 'src/app/models/invite.model';

@Component({
  selector: 'app-invite-list-item',
  templateUrl: './invite-list-item.component.html',
  styleUrls: ['./invite-list-item.component.scss']
})
export class InviteListItemComponent implements OnInit {
  @Input() invite: Invite;

  @Output() accepted = new EventEmitter<Invite>();
  @Output() refused = new EventEmitter<Invite>();

  constructor() { }

  ngOnInit() {
  }

  accept() {
    this.accepted.emit(this.invite);
  }

  refuse() {
    this.refused.emit(this.invite);
  }

}
