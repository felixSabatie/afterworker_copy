import {Component, Input, OnInit} from '@angular/core';
import {VotingItem} from "../../../models/voting-item.model";

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss']
})
export class VotingComponent implements OnInit {
  @Input() title: string;
  @Input() votingItems: VotingItem[];

  constructor() { }

  ngOnInit() {
  }

}
