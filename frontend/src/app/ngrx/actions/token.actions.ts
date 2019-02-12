import {Action} from "@ngrx/store";

export enum ActionTypes {
  SetToken = '[TOKEN] Set',
  DestroyToken = '[TOKEN] Destroy'
}

export class SetToken implements Action {
  readonly type = ActionTypes.SetToken;

  constructor(public payload: string) { }
}

export class DestroyToken implements Action {
  readonly type = ActionTypes.DestroyToken;
}
