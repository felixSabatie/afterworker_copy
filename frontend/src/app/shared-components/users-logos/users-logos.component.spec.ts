import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersLogosComponent } from './users-logos.component';

describe('UsersLogosComponent', () => {
  let component: UsersLogosComponent;
  let fixture: ComponentFixture<UsersLogosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersLogosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersLogosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
