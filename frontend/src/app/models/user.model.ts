import {Event} from "./event.model";
import {Invite} from "./invite.model";

export interface User {
  id: number;
  username: string;
  email: string;
  avatar_link: string;

  events: Event[];
  invites: Invite[];
}
