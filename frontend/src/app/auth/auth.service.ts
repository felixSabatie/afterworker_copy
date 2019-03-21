import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  getToken(userInfos: object): Observable<any> {
    return this.http.post(environment.baseUrl + '/user_token', {auth: userInfos});
  }

}
