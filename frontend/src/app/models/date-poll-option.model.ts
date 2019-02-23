import {User} from "./user.model";

export interface DatePollOption {
  id: number;
  date: Date;
  voters: User[];
}
