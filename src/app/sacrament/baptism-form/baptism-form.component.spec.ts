import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaptismFormComponent } from './baptism-form.component';

describe('BaptismFormComponent', () => {
  let component: BaptismFormComponent;
  let fixture: ComponentFixture<BaptismFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaptismFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaptismFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
