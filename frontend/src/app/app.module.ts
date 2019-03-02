import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";

import { AuthInterceptor } from "./http-interceptors/auth-interceptor";

import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthComponent } from './auth/auth.component';

import {ActionReducer, MetaReducer, StoreModule} from '@ngrx/store';
import {reducers} from "./ngrx/reducers";
import { HomeComponent } from './home/home.component';
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import { NavbarComponent } from './navbar/navbar.component';
import {localStorageSync} from "ngrx-store-localstorage";
import { EventComponent } from './home/event/event.component';
import { UsersAvatarsComponent } from './shared-components/users-logos/users-avatars.component';
import { ModalComponent } from './shared-components/modal/modal.component';
import { UsersListComponent } from './shared-components/users-list/users-list.component';
import { UsersListItemComponent } from './shared-components/users-list/users-list-item/users-list-item.component';
import { EventFormComponent } from './home/event-form/event-form.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { DashboardComponent } from './event/dashboard/dashboard.component';

const STORE_KEYS_TO_PERSIST = ['token', 'user'];

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({
    keys: STORE_KEYS_TO_PERSIST,
    rehydrate: true,
    removeOnUndefined: true,
  })(reducer);
}
const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SpinnerComponent,
    RegisterComponent,
    AuthComponent,
    HomeComponent,
    NavbarComponent,
    EventComponent,
    UsersAvatarsComponent,
    ModalComponent,
    UsersListComponent,
    UsersListItemComponent,
    EventFormComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    HttpClientModule,
    StoreModule.forRoot(reducers, {metaReducers}),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
    }),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
