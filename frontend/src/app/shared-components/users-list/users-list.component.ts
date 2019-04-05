import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  @Input() users: User[];
  @Input() creatorId: number;
  @Input() clickable = false;

  @Output() userClicked = new EventEmitter<User>();

  constructor() { }

  ngOnInit() {
  }

  userClick(user: User) {
    this.userClicked.emit(user);
  }

}
