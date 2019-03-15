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
  @Input() modalTitle: string;
  @Input() creatorId: number;
  showModal = false;

  constructor() { }

  ngOnInit() {
  }

  get usersLeft() {
    if(this.users.length > this.maxAvatars) {
      return this.users.length - this.maxAvatars;
    } else {
      return 0;
    }
  }

  get usersToDisplay() {
    return this.users.slice(0, this.maxAvatars);
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

}
