import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePollComponent } from './date-poll.component';

describe('DatePollComponent', () => {
  let component: DatePollComponent;
  let fixture: ComponentFixture<DatePollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatePollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatePollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
