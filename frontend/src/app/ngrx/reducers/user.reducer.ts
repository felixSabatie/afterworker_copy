import * as UserActions from '../actions/user.actions';
import {Action} from '@ngrx/store';
import {User} from "../../models/user.model";

export function userReducer(state: User, action: Action) {
  switch(action.type) {
    case UserActions.SET_USER:
      return (action as UserActions.SetUser).payload;
    case UserActions.DESTROY_USER:
      return [state, null];
    default:
      return state;
  }
}
