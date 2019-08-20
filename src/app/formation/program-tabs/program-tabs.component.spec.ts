import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramTabsComponent } from './program-tabs.component';

describe('ProgramTabsComponent', () => {
  let component: ProgramTabsComponent;
  let fixture: ComponentFixture<ProgramTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
