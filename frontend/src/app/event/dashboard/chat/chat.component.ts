import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Event } from 'src/app/models/event.model';
import { ChatService } from './chat.service';
import { Message } from 'src/app/models/message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @Input() event: Event;
  @Input() currentUser: User;
  messages: Message[];

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.chatService.connectToEvent(this.event, this.currentUser);
    this.chatService.getMessages().subscribe((messages: Message[]) => {
      this.messages = messages;
    });
  }

}
