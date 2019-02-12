import {Action} from '@ngrx/store';
import {User} from "../../models/user.model";

export const SET_USER = '[USER] Set';
export const DESTROY_USER = '[USER] Destroy';

export class SetUser implements Action {
  readonly type = SET_USER;

  constructor(public payload: User) { }
}

export class DestroyUser implements Action {
  readonly type = DESTROY_USER;
}

export type Actions = SetUser | DestroyUser;
