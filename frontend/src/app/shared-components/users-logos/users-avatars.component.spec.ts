import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAvatarsComponent } from './users-avatars.component';

describe('UsersAvatarsComponent', () => {
  let component: UsersAvatarsComponent;
  let fixture: ComponentFixture<UsersAvatarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersAvatarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersAvatarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
