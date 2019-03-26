import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacePollComponent } from './place-poll.component';

describe('PlacePollComponent', () => {
  let component: PlacePollComponent;
  let fixture: ComponentFixture<PlacePollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlacePollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacePollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
