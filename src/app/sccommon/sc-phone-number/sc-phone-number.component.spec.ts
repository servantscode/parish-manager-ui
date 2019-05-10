import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScPhoneNumberComponent } from './sc-phone-number.component';

describe('ScPhoneNumberComponent', () => {
  let component: ScPhoneNumberComponent;
  let fixture: ComponentFixture<ScPhoneNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScPhoneNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScPhoneNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
