import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceTabsComponent } from './finance-tabs.component';

describe('FinanceTabsComponent', () => {
  let component: FinanceTabsComponent;
  let fixture: ComponentFixture<FinanceTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
