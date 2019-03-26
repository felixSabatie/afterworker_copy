import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private swUpdate: SwUpdate) { }

  ngOnInit() {
    this.swUpdate.available.subscribe(event => {
      if (confirm('A new update is available, do you want to refresh now ?')) {
        window.location.reload();
      }
    });

    this.swUpdate.checkForUpdate();
  }
}
