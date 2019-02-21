import {Action} from "@ngrx/store";
import * as TokenActions from "../actions/token.actions";
import * as GlobalActions from '../actions/global.actions';

export function tokenReducer (state: string, action: Action) {
  switch(action.type) {
    case TokenActions.ActionTypes.SetToken:
      return (action as TokenActions.SetToken).payload;
    case GlobalActions.ActionTypes.ResetAll:
      return undefined;
    default:
      return state;
  }
}
