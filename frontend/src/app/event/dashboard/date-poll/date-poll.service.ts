import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Event} from '../../../models/event.model';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {DatePollOption} from '../../../models/date-poll-option.model';

@Injectable({
  providedIn: 'root'
})
export class DatePollService {

  constructor(private http: HttpClient) {
  }

  createDatePollOption(event: Event, datePollOption: DatePollOption): Observable<DatePollOption> {
    return this.http.post<any>(`${environment.baseUrl}/events/${event.event_hash}/date-poll`,
      {date_poll_option: datePollOption})
      .pipe(map(response => response.date_poll_option));
  }

  toggleVote(event: Event, datePollOptionId: number): Observable<any> {
    return this.http.post(`${environment.baseUrl}/events/${event.event_hash}/date-poll/${datePollOptionId}/toggle`, {});
  }

  chooseDate(event: Event, datePollOptionId: number): Observable<any> {
    return this.http.put(`${environment.baseUrl}/events/${event.event_hash}/date-poll/${datePollOptionId}/choose-date`, {});
  }

  deleteChosenDate(event: Event): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/events/${event.event_hash}/date-poll/chosen-date`, {});
  }
}
