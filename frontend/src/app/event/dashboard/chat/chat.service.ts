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

  connectToEvent(event: Event, user: User, token: string) {
    this.socket.emit('connectToEvent', {event: {hash: event.event_hash}, user: {id: user.id}, token});
  }

  getMessages(): Observable<Message[]> {
    return Observable.create(observer => {
      this.socket.on('messages', payload => {
        observer.next(payload.messages);
      });
    });
  }

  sendMessage(message: Message) {
    this.socket.emit('newMessage', message);
  }

  getNewMessage(): Observable<Message> {
    return Observable.create(observer => {
      this.socket.on('newMessage', payload => {
        observer.next(payload.message);
      });
    });
  }
}
