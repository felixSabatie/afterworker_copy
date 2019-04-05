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
  waitingForResonse = false;
  searchUsers: User[] = [];

  constructor(private userService: UserService, private invitesService: InvitesService, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      username: this.usernameControl,
    });
  }

  ngOnInit() {
    this.usernameControl.valueChanges.pipe(debounceTime(500)).subscribe(newUsername => {
      if (newUsername.length > 0) {
        this.userService.search(newUsername).subscribe(users => {
          this.searchUsers = users;
        });
      }
    });
  }

  get invitedUsers(): User[] {
    return this.event.invites.map(invite => invite.user);
  }

  createInvite() {
    this.waitingForResonse = true;
    const user = this.searchUsers[0];

    this.invitesService.create(this.event, user.id).subscribe(invite => {
      this.waitingForResonse = false;
      this.createdInvite.emit(invite);
      this.usernameControl.setValue('');
    });
  }

}
