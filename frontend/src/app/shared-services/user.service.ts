import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {User} from "../models/user.model";
import {Observable} from "rxjs";
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getCurrentUser(): Observable<User> {
    return this.http.get<any>(environment.baseUrl + '/users/current')
      .pipe(map(response => response.user));
  }

  register(userInfos: Object): Observable<any> {
    return this.http.post(environment.baseUrl + '/users', {user: userInfos})
  }

}
