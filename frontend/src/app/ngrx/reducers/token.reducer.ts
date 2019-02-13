import {Action} from "@ngrx/store";
import * as TokenActions from "../actions/token.actions";

export function tokenReducer (state: string, action: Action) {
  switch(action.type) {
    case TokenActions.ActionTypes.SetToken:
      return (action as TokenActions.SetToken).payload;
    case TokenActions.ActionTypes.DestroyToken:
      return null;
    default:
      return state;
  }
}
