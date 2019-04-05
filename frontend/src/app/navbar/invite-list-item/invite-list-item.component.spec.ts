import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteListItemComponent } from './invite-list-item.component';

describe('InviteListItemComponent', () => {
  let component: InviteListItemComponent;
  let fixture: ComponentFixture<InviteListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
