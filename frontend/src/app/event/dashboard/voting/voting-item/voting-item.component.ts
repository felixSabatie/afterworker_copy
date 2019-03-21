import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VotingItem} from '../../../../models/voting-item.model';
import {User} from '../../../../models/user.model';

@Component({
  selector: 'app-voting-item',
  templateUrl: './voting-item.component.html',
  styleUrls: ['./voting-item.component.scss']
})
export class VotingItemComponent implements OnInit {
  @Input() votingItem: VotingItem;
  @Input() nbParticipants: number;
  @Input() currentUser: User;
  @Input() isAdmin: boolean;
  @Input() itemType: string;

  @Output() changedVote = new EventEmitter<boolean>();
  @Output() choseItem = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  get voted() {
    return this.votingItem.voters &&
      this.votingItem.voters.some(voter => voter.id === this.currentUser.id);
  }

  get percentage() {
    const nbVoters = this.votingItem.voters ? this.votingItem.voters.length : 0;
    return Math.round(100 * nbVoters / this.nbParticipants);
  }

  clicked(e: Event) {
    e.preventDefault();
    this.changedVote.emit(!this.voted);
  }

  chooseItem(e: Event) {
    e.preventDefault();
    this.choseItem.emit();
  }

}
