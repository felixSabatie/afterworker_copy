import {User} from "./user.model";
import {Event} from "./event.model";

export interface Invite {
  id: number;
  token: string;

  event: Event;
  user: User;
}
