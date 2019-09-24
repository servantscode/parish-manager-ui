import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistryRoleComponent } from './ministry-role.component';

describe('MinistryRoleComponent', () => {
  let component: MinistryRoleComponent;
  let fixture: ComponentFixture<MinistryRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinistryRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinistryRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
