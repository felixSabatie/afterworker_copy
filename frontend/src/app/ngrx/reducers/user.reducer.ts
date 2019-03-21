import * as UserActions from '../actions/user.actions';
import * as GlobalActions from '../actions/global.actions';
import {Action} from '@ngrx/store';
import {User} from '../../models/user.model';

export function userReducer(state: User, action: Action) {
  switch (action.type) {
    case UserActions.ActionTypes.SetUser:
      return (action as UserActions.SetUser).payload;
    case GlobalActions.ActionTypes.ResetAll:
      return undefined;
    default:
      return state;
  }
}
