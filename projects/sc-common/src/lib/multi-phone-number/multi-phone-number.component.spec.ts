import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonPhoneNumberComponent } from './person-phone-number.component';

describe('PersonPhoneNumberComponent', () => {
  let component: PersonPhoneNumberComponent;
  let fixture: ComponentFixture<PersonPhoneNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonPhoneNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonPhoneNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
