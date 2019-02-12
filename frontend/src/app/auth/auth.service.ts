import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  getToken(userInfos: Object): Observable<any> {
    return this.http.post(environment.baseUrl + '/user_token', {auth: userInfos})
  }

  register(userInfos: Object): Observable<any> {
    console.log('executing');
    return this.http.post(environment.baseUrl + '/users', {user: userInfos})
  }

}
