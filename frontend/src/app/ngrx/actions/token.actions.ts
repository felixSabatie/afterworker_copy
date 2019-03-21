import {Action} from '@ngrx/store';

export enum ActionTypes {
  SetToken = '[TOKEN] Set',
}

export class SetToken implements Action {
  readonly type = ActionTypes.SetToken;

  constructor(public payload: string) { }
}
