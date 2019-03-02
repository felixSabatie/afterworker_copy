import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {faTimes} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() modalTitle: string;
  @Input() show: boolean = false;
  faTimes = faTimes;

  @Output() close = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  closeModal() {
    this.close.emit();
  }

}
