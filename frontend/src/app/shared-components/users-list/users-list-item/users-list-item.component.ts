import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../models/user.model";

@Component({
  selector: 'app-users-list-item',
  templateUrl: './users-list-item.component.html',
  styleUrls: ['./users-list-item.component.scss']
})
export class UsersListItemComponent implements OnInit {
  @Input() user: User;

  constructor() { }

  ngOnInit() {
  }

}
