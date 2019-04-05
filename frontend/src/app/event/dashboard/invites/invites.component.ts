import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Event } from 'src/app/models/event.model';
import { UserService } from 'src/app/shared-services/user.service';
import { InvitesService } from 'src/app/shared-services/invites.service';
import { Invite } from 'src/app/models/invite.model';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.scss']
})
export class InvitesComponent implements OnInit {
  @Input() event: Event;
  @Output() createdInvite = new EventEmitter<Invite>();

  searchForm: FormGroup;
  usernameControl = new FormControl();
  waitingForResponse = false;
  waitingForUsersSearchResponse = false;
  searchUsers: User[] = [];

  constructor(private userService: UserService, private invitesService: InvitesService, private fb: FormBuilder) {
    this.usernameControl.setValue('');
    this.searchForm = this.fb.group({
      username: this.usernameControl,
    });
  }

  ngOnInit() {
    this.usernameControl.valueChanges.subscribe(() => this.waitingForUsersSearchResponse = true);
    this.usernameControl.valueChanges.pipe(debounceTime(500)).subscribe(newUsername => {
      if (newUsername.length > 0) {
        this.userService.search(newUsername).subscribe(users => {
          this.searchUsers = users.filter(user => !this.userInEvent(user));
          this.waitingForUsersSearchResponse = false;
        });
      } else {
        this.searchUsers = [];
      }
    });
  }

  get invitedUsers(): User[] {
    return this.event.invites.map(invite => invite.user);
  }

  createInvite(user: User) {
    this.waitingForResponse = true;
    this.invitesService.create(this.event, user.id).subscribe(invite => {
      this.waitingForResponse = false;
      this.createdInvite.emit(invite);
      this.usernameControl.setValue('');
    });
  }

  private userInEvent(user: User): boolean {
    return this.userInArray(user, this.event.participants) || this.userInArray(user, this.event.invites.map(i => i.user));
  }

  private userInArray(user: User, array: User[]): boolean {
    return array.some(u => u.id === user.id);
  }
}
