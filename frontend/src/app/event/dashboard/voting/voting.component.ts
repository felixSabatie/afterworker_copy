import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VotingItem} from "../../../models/voting-item.model";
import {User} from "../../../models/user.model";

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss']
})
export class VotingComponent implements OnInit {
  @Input() pollTitle: string;
  @Input() votingItems: VotingItem[];
  @Input() nbParticipants: number;
  @Input() currentUser: User;
  @Output() changedVote = new EventEmitter<object>();

  constructor() { }

  ngOnInit() {
  }

  changeVote(e: boolean, optionId: number) {
    this.changedVote.emit({optionId: optionId, voted: e});
  }

}
