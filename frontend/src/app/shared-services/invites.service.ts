import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Invite } from '../models/invite.model';
import { Event } from '../models/event.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InvitesService {

  constructor(private http: HttpClient) { }

  accept(invite: Invite): Observable<any> {
    return this.http.post(`${environment.baseUrl}/invites/${invite.id}/accept`, {});
  }

  refuse(invite: Invite): Observable<any> {
    return this.http.post(`${environment.baseUrl}/invites/${invite.id}/refuse`, {});
  }

  get(): Observable<Invite[]> {
    return this.http.get<any>(`${environment.baseUrl}/invites`)
      .pipe(map(response => response.invites));
  }

  create(event: Event, userId: number): Observable<Invite> {
    return this.http.post<any>(`${environment.baseUrl}/events/${event.event_hash}/invite`, {user_id: userId})
      .pipe(map(response => response.invite));
  }
}
