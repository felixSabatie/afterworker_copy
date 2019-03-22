import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Event } from '../../../models/event.model';
import { User } from 'src/app/models/user.model';
import { Observable } from 'rxjs';
import { Message } from 'src/app/models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket) { }

  connectToEvent(event: Event, user: User) {
    this.socket.emit('connectToEvent', {event: {hash: event.event_hash}, user: {id: user.id}});
  }

  getMessages(): Observable<Message[]> {
    return Observable.create(observer => {
      this.socket.on('messages', (messages: Message[]) => {
        observer.next(messages);
      });
    });
  }
}
