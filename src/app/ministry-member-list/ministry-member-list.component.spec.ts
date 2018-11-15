import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistryMemberListComponent } from './ministry-member-list.component';

describe('MinistryMemberListComponent', () => {
  let component: MinistryMemberListComponent;
  let fixture: ComponentFixture<MinistryMemberListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinistryMemberListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinistryMemberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
