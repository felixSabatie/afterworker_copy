import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../ngrx/app.state';
import * as GlobalActions from '../ngrx/actions/global.actions';

@Injectable()
export class HttpErrorsInterceptor implements HttpInterceptor {

  constructor(private router: Router, private store: Store<AppState>) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(tap(event => {}, (err: HttpErrorResponse) => {
      if (err.status && err.status === 401) {
        this.logout();
        this.router.navigate(['login']);
      }
    }));
  }

  private logout() {
    this.store.dispatch(new GlobalActions.ResetAll());
  }
}
