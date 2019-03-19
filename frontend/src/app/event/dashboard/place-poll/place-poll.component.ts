import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Event} from "../../../models/event.model";
import {VotingItem} from "../../../models/voting-item.model";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import {User} from "../../../models/user.model";
import {PlacePollService} from "./place-poll.service";
import {PlacePollOption} from "../../../models/place-poll-option.model";

@Component({
  selector: 'app-place-poll',
  templateUrl: './place-poll.component.html',
  styleUrls: ['./place-poll.component.scss']
})
export class PlacePollComponent implements OnInit {
  @Input() event: Event;
  @Input() currentUser: User;
  @Input() isAdmin: boolean;

  @Output() chosePlace = new EventEmitter<number>();
  @Output() deletedChosenPlace = new EventEmitter();
  @Output() createdPlace = new EventEmitter<PlacePollOption>();

  placeName = '';
  placePollVotingItems: VotingItem[] = [];
  faMapMarkerAlt = faMapMarkerAlt;
  waitingForResponse = false;

  constructor(private placePollService: PlacePollService) {
  }

  ngOnInit() {
    this.placePollVotingItems = this.event.place_poll_options.map(placePollOption => {
      return {
        id: placePollOption.id,
        name: placePollOption.name,
        voters: placePollOption.voters,
      }
    });
    this.orderPlacePollVotingItems();
  }

  orderPlacePollVotingItems() {
    this.placePollVotingItems.sort((item1, item2) => item2.voters.length - item1.voters.length);
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

    this.orderPlacePollVotingItems();
    this.placePollService.toggleVote(this.event, e.optionId).subscribe();
  }

  createPlace() {
    if(this.placeName.length > 0) {
      this.waitingForResponse = true;
      this.placePollService.createPlacePollOption(this.event, {name: this.placeName} as PlacePollOption)
        .subscribe(placePollOption => {
          this.placePollVotingItems = [...this.placePollVotingItems, {
            id: placePollOption.id,
            name: placePollOption.name,
            voters: placePollOption.voters,
          } as VotingItem];
          this.placeName = '';
          this.waitingForResponse = false;

          this.createdPlace.emit(placePollOption);
        });
    }
  }

  choosePlace(placeId: number) {
    this.chosePlace.emit(placeId);
  }

  deleteChosenPlace() {
    this.deletedChosenPlace.emit();
  }

}
