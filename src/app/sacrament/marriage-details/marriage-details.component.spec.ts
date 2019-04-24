import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarriageDetailsComponent } from './marriage-details.component';

describe('MarriageDetailsComponent', () => {
  let component: MarriageDetailsComponent;
  let fixture: ComponentFixture<MarriageDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarriageDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarriageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
