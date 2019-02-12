import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthComponent } from './auth/auth.component';

import {StoreModule} from '@ngrx/store';
import * as reducers from "./ngrx/reducers";
import { HomeComponent } from './home/home.component';
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {environment} from "../environments/environment";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SpinnerComponent,
    RegisterComponent,
    AuthComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    HttpClientModule,
    StoreModule.forRoot({
      user: reducers.userReducer
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
