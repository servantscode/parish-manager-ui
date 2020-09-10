import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyContributionComponent } from './family-contribution.component';

describe('FamilyContributionComponent', () => {
  let component: FamilyContributionComponent;
  let fixture: ComponentFixture<FamilyContributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyContributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyContributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
