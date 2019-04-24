import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarriageComponent } from './marriage.component';

describe('MarriageComponent', () => {
  let component: MarriageComponent;
  let fixture: ComponentFixture<MarriageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarriageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarriageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
