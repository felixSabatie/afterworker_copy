import {Component, Inject, Input, LOCALE_ID, OnInit, Output, EventEmitter} from '@angular/core';
import {Event} from '../../../models/event.model';
import {User} from '../../../models/user.model';
import {VotingItem} from '../../../models/voting-item.model';
import {faCalendarAlt} from '@fortawesome/free-solid-svg-icons';
import {DatePollService} from './date-poll.service';
import {formatDate} from '@angular/common';
import {DatePollOption} from '../../../models/date-poll-option.model';

@Component({
  selector: 'app-date-poll',
  templateUrl: './date-poll.component.html',
  styleUrls: ['./date-poll.component.scss']
})
export class DatePollComponent implements OnInit {
  @Input() event: Event;
  @Input() currentUser: User;
  @Input() isAdmin: boolean;

  @Output() choseDate = new EventEmitter<number>();
  @Output() deletedChosenDate = new EventEmitter();
  @Output() createdDate = new EventEmitter<DatePollOption>();

  date: Date;
  datePollVotingItems: VotingItem[] = [];
  faCalendarAlt = faCalendarAlt;
  waitingForResponse = false;
  startAt = new Date();

  constructor(private datePollService: DatePollService,
              @Inject(LOCALE_ID) public locale: string) {
    this.startAt.setHours(this.startAt.getHours() + 1);
    this.startAt.setMinutes(0);
    this.startAt.setSeconds(0);
  }

  ngOnInit() {
    this.datePollVotingItems = this.event.date_poll_options.map(datePollOption => {
      return {
        id: datePollOption.id,
        name: this.dateToString(datePollOption.date),
        voters: datePollOption.voters,
      };
    });
    this.orderdatePollVotingItems();
  }

  orderdatePollVotingItems() {
    this.datePollVotingItems.sort((item1, item2) => item2.voters.length - item1.voters.length);
  }

  changeVote(e: any) {
    if (e.voted) {
      this.datePollVotingItems.find(item => item.id === e.optionId).voters
        .push(this.currentUser);
    } else {
      const voters = this.datePollVotingItems.find(item => item.id === e.optionId).voters;
      const currentUserVoterId = voters.findIndex(voter => voter.id === this.currentUser.id);
      voters.splice(currentUserVoterId, 1);
    }

    this.orderdatePollVotingItems();
    this.datePollService.toggleVote(this.event, e.optionId).subscribe();
  }

  createDate() {
    if (this.date !== undefined) {
      this.waitingForResponse = true;
      this.datePollService.createDatePollOption(this.event, {date: this.date} as DatePollOption)
        .subscribe(datePollOption => {
          this.datePollVotingItems = [...this.datePollVotingItems, {
            id: datePollOption.id,
            name: this.dateToString(this.date),
            voters: datePollOption.voters,
          } as VotingItem];
          this.date = undefined;
          this.waitingForResponse = false;

          this.createdDate.emit(datePollOption);
        });
    }
  }

  dateToString(date: Date): string {
    return formatDate(date, 'LLL dd yyyy, HH:mm', this.locale);
  }

  chooseDate(dateId: number) {
    this.choseDate.emit(dateId);
  }

  deleteChosenDate() {
    this.deletedChosenDate.emit();
  }

}
