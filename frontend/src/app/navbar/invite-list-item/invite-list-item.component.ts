import { Component, OnInit, Input } from '@angular/core';
import { Invite } from 'src/app/models/invite.model';

@Component({
  selector: 'app-invite-list-item',
  templateUrl: './invite-list-item.component.html',
  styleUrls: ['./invite-list-item.component.scss']
})
export class InviteListItemComponent implements OnInit {
  @Input() invite: Invite;

  constructor() { }

  ngOnInit() {
  }

}
