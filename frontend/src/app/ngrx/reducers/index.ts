import { userReducer } from './user.reducer';
import {tokenReducer} from "./token.reducer";

export const reducers = {
  user: userReducer,
  token: tokenReducer
};
