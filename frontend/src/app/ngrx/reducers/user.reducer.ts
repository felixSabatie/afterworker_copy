import * as UserActions from '../actions/user.actions';
import {Action} from '@ngrx/store';
import {User} from "../../models/user.model";

export function userReducer(state: User, action: Action) {
  switch(action.type) {
    case UserActions.ActionTypes.SetUser:
      return (action as UserActions.SetUser).payload;
    case UserActions.ActionTypes.DestroyUser:
      return [state, null];
    default:
      return state;
  }
}
