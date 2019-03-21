import {Action} from '@ngrx/store';

export enum ActionTypes {
  ResetAll = '[GLOBAL] Reset',
}

export class ResetAll implements Action {
  readonly type = ActionTypes.ResetAll;
}
