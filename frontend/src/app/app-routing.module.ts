import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";
import {HomeComponent} from "./home/home.component";
import {DashboardComponent} from "./event/dashboard/dashboard.component";
import {NotFoundComponent} from './not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'events/:hash', component: DashboardComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
