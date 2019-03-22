import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Event } from 'src/app/models/event.model';
import { ChatService } from './chat.service';
import { Message } from 'src/app/models/message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @Input() event: Event;
  @Input() currentUser: User;

  @ViewChild('messagesScrollable') private messagesScrollable: ElementRef;

  messages: Message[] = [];
  formMessage: Message = {
    message: ''
  } as Message;
  participants: Map<number, User>;

  scrollToBottomNext = false;

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.participants = new Map(this.event.participants.map((user): [number, User] => [user.id, user]));

    this.chatService.connectToEvent(this.event, this.currentUser);
    this.chatService.getMessages().subscribe((messages: Message[]) => {
      messages.forEach(message => this.addMessageToList(message));
    });
    this.chatService.getNewMessage().subscribe((message: Message) => {
      this.addMessageToList(message);
    });

    this.formMessage.creator = this.currentUser;
    this.scrollToBottomNext = true;
  }

  addMessageToList(message: Message) {
    if (message.creator === undefined) {
      message.creator = this.participants.get(message.creator_id);
    }
    this.messages.push(message);
    this.scrollToBottomNext = true;
  }

  sendMessage() {
    this.formMessage.createdAt = new Date();
    this.chatService.sendMessage(this.formMessage);

    this.addMessageToList({...this.formMessage});

    this.formMessage.message = '';
  }

  ngAfterViewChecked() {
    if (this.scrollToBottomNext) {
      this.scrollMessagesToBottom();
      this.scrollToBottomNext = false;
    }
  }

  scrollMessagesToBottom() {
    this.messagesScrollable.nativeElement.scrollTop = this.messagesScrollable.nativeElement.scrollHeight;
  }

}
