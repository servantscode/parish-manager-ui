import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaptismDetailsComponent } from './baptism-details.component';

describe('BaptismDetailsComponent', () => {
  let component: BaptismDetailsComponent;
  let fixture: ComponentFixture<BaptismDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaptismDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaptismDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
