import {Component, ElementRef, EventEmitter, Input, OnInit, Output,
  SimpleChanges, ViewChild, OnChanges, AfterViewChecked} from '@angular/core';
import {VotingItem} from '../../../models/voting-item.model';
import {User} from '../../../models/user.model';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss']
})
export class VotingComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() pollTitle: string;
  @Input() votingItems: VotingItem[];
  @Input() nbParticipants: number;
  @Input() currentUser: User;
  @Input() isAdmin: boolean;
  @Input() itemType: string;

  @Output() changedVote = new EventEmitter<object>();
  @Output() choseItem = new EventEmitter<number>();
  @ViewChild('votingItemsScrollable') private votingItemsScrollable: ElementRef;

  scrollToBottomNext = false;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const votingItemsChange = changes.votingItems;
    if (votingItemsChange && votingItemsChange.previousValue && votingItemsChange.currentValue
      && votingItemsChange.previousValue.length < votingItemsChange.currentValue.length) {
      this.scrollToBottomNext = true;
    }
  }

  ngAfterViewChecked() {
    if (this.scrollToBottomNext) {
      this.scrollVotingItemsToBottom();
      this.scrollToBottomNext = false;
    }
  }

  scrollVotingItemsToBottom() {
    this.votingItemsScrollable.nativeElement.scrollTop = this.votingItemsScrollable.nativeElement.scrollHeight;
  }

  changeVote(e: boolean, optionId: number) {
    this.changedVote.emit({optionId, voted: e});
  }

  chooseItem(optionId: number) {
    this.choseItem.emit(optionId);
  }

}
