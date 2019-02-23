import {User} from "./user.model";

export interface PlacePollOption {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  voters: User[];
}
