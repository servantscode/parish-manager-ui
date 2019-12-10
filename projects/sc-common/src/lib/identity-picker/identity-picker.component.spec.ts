import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentityPickerComponent } from './identity-picker.component';

describe('IdentityPickerComponent', () => {
  let component: IdentityPickerComponent;
  let fixture: ComponentFixture<IdentityPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdentityPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentityPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
