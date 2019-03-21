import {Action} from '@ngrx/store';
import {User} from '../../models/user.model';

export enum ActionTypes {
  SetUser = '[USER] Set',
}

export class SetUser implements Action {
  readonly type = ActionTypes.SetUser;

  constructor(public payload: User) { }
}
