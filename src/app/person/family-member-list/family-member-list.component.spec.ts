import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyMemberListComponent } from './family-member-list.component';

describe('FamilyMemberListComponent', () => {
  let component: FamilyMemberListComponent;
  let fixture: ComponentFixture<FamilyMemberListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyMemberListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyMemberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
