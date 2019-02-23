import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../models/user.model";

@Component({
  selector: 'app-users-logos',
  templateUrl: './users-avatars.component.html',
  styleUrls: ['./users-avatars.component.scss']
})
export class UsersAvatarsComponent implements OnInit {
  @Input() users: User[];
  @Input() maxAvatars: number;
  usersToDisplay: User[] = [];
  usersLeft = 0;

  constructor() { }

  ngOnInit() {
    this.usersToDisplay = this.users.slice(0, this.maxAvatars);
    if(this.users.length > this.maxAvatars) {
      this.usersLeft = this.users.length - this.maxAvatars;
    }
  }

}
