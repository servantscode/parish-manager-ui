import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDateSeriesComponent } from './custom-date-series.component';

describe('CustomDateSeriesComponent', () => {
  let component: CustomDateSeriesComponent;
  let fixture: ComponentFixture<CustomDateSeriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomDateSeriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDateSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
