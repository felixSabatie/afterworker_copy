import { User } from './user.model';
import { Event } from './event.model';

export interface Message {
    message: string;
    createdAt: Date;
    creator_id: number;
    creator: User;
    event_hash: string;
    event: Event;
}
