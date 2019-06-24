import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateSeriesComponent } from './date-series.component';

describe('DateSeriesComponent', () => {
  let component: DateSeriesComponent;
  let fixture: ComponentFixture<DateSeriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateSeriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
