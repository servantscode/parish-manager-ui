import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyFinancialComponent } from './family-financial.component';

describe('FamilyFinancialComponent', () => {
  let component: FamilyFinancialComponent;
  let fixture: ComponentFixture<FamilyFinancialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyFinancialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyFinancialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
