import {Action} from '@ngrx/store';
import {User} from "../../models/user.model";

export enum ActionTypes {
  SetUser = '[USER] Set',
  DestroyUser = '[USER] Destroy',
}

export class SetUser implements Action {
  readonly type = ActionTypes.SetUser;

  constructor(public payload: User) { }
}

export class DestroyUser implements Action {
  readonly type = ActionTypes.DestroyUser;
}
