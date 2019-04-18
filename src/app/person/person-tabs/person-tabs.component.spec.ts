import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonTabsComponent } from './person-tabs.component';

describe('PersonTabsComponent', () => {
  let component: PersonTabsComponent;
  let fixture: ComponentFixture<PersonTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
