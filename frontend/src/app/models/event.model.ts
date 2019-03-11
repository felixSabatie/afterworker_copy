import {User} from "./user.model";
import {PlacePollOption} from "./place-poll-option.model";
import {DatePollOption} from "./date-poll-option.model";
import {Invite} from "./invite.model";

export interface Event {
  id: number;
  event_hash: string;
  name: string;
  is_open_to_dates: boolean;
  is_open_to_places: boolean;
  has_date_poll: boolean;
  has_place_poll: boolean;

  creator: User;
  participants: User[];

  chosen_date: DatePollOption;
  chosen_place: PlacePollOption;

  date_poll_options: DatePollOption[];
  place_poll_options: PlacePollOption[];

  invites: Invite[];
}
