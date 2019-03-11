import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VotingItem} from "../../../../models/voting-item.model";

@Component({
  selector: 'app-voting-item',
  templateUrl: './voting-item.component.html',
  styleUrls: ['./voting-item.component.scss']
})
export class VotingItemComponent implements OnInit {
  @Input() votingItem: VotingItem;
  @Input() nbParticipants: number;
  @Input() voted: boolean;
  @Output() toggledVote = new EventEmitter;

  percentage: number;

  constructor() { }

  ngOnInit() {
    this.percentage = Math.round(100 * this.votingItem.voters.length / this.nbParticipants);
  }

  clicked(e: Event) {
    e.preventDefault();
    this.toggledVote.emit();
  }

}
