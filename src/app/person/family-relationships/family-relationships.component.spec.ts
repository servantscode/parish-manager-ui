import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyRelationshipsComponent } from './family-relationships.component';

describe('FamilyRelationshipsComponent', () => {
  let component: FamilyRelationshipsComponent;
  let fixture: ComponentFixture<FamilyRelationshipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyRelationshipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyRelationshipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
