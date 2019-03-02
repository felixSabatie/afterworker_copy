import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Event} from "../models/event.model";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {PlacePollOption} from "../models/place-poll-option.model";
import {DatePollOption} from "../models/date-poll-option.model";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  getEvents(): Observable<Event[]> {
    return this.http.get<any>(environment.baseUrl + '/events')
      .pipe(map(response => response.events));
  }

  createEvent(event: Event, place: PlacePollOption = undefined, date: DatePollOption = undefined): Observable<Event> {
    return this.http.post<any>(environment.baseUrl + '/events', {event, place, date})
      .pipe(map(response => response.event));
  }
}
