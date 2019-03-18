import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Event} from "../../../models/event.model";
import {PlacePollOption} from "../../../models/place-poll-option.model";
import {Observable} from "rxjs";
import {environment} from 'src/environments/environment';
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PlacePollService {

  constructor(private http: HttpClient) {
  }

  createPlacePollOption(event: Event, placePollOption: PlacePollOption): Observable<PlacePollOption> {
    return this.http.post<any>(`${environment.baseUrl}/events/${event.event_hash}/place-poll`,
      {place_poll_option: placePollOption})
      .pipe(map(response => response.place_poll_option));
  }

  toggleVote(event: Event, placePollOptionId: number): Observable<any> {
    return this.http.post(`${environment.baseUrl}/events/${event.event_hash}/place-poll/${placePollOptionId}/toggle`, {})
  }

  choosePlace(event: Event, placePollOptionId: number): Observable<any> {
    return this.http.put(`${environment.baseUrl}/events/${event.event_hash}/place-poll/${placePollOptionId}/choose-place`, {})
  }
}


