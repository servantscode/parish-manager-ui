import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationReviewComponent } from './registration-review.component';

describe('RegistrationReviewComponent', () => {
  let component: RegistrationReviewComponent;
  let fixture: ComponentFixture<RegistrationReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
