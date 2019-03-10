import {User} from "./user.model";

export interface VotingItem {
  id: number;
  name: string;
  voters: User[];
}
