import {Component, Input, OnInit} from '@angular/core';
import {Event} from "../../../models/event.model";
import {VotingItem} from "../../../models/voting-item.model";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import {User} from "../../../models/user.model";

@Component({
  selector: 'app-place-poll',
  templateUrl: './place-poll.component.html',
  styleUrls: ['./place-poll.component.scss']
})
export class PlacePollComponent implements OnInit {
  @Input() event: Event;
  @Input() currentUser: User;

  placeName = '';
  placePollVotingItems: VotingItem[] = [];
  faMapMarkerAlt = faMapMarkerAlt;

  constructor() {
  }

  ngOnInit() {
    this.placePollVotingItems = this.event.place_poll_options.map(placePollOption => {
      return {
        id: placePollOption.id,
        name: placePollOption.name,
        voters: placePollOption.voters,
      }
    });
  }

  changeVote(e: any) {
    if(e.voted) {
      this.placePollVotingItems.find(item => item.id === e.optionId).voters
        .push(this.currentUser);
    } else {
      const voters = this.placePollVotingItems.find(item => item.id === e.optionId).voters;
      const currentUserVoterId = voters.findIndex(voter => voter.id === this.currentUser.id);
      voters.splice(currentUserVoterId, 1);
    }
  }

  createPlace() {
    if(this.placeName.length > 0) {
      this.placePollVotingItems.push({name: this.placeName, voters: []} as VotingItem);
      this.placeName = '';
    }
  }

}
