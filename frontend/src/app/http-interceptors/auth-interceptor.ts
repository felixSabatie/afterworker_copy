import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../ngrx/app.state';
import {first, flatMap} from 'rxjs/operators';
import {Injectable} from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store<AppState>) { }

  // https://antonyderham.me/post/angular-ngrx-auth-interceptor/
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select('token').pipe(
      first(),
      flatMap(token => {
        const authReq = !!token ? req.clone({
          setHeaders: { Authorization: 'Bearer ' + token },
        }) : req;
        return next.handle(authReq);
      })
    );
  }
}
