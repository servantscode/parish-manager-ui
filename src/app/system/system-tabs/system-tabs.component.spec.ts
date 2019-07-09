import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemTabsComponent } from './system-tabs.component';

describe('SystemTabsComponent', () => {
  let component: SystemTabsComponent;
  let fixture: ComponentFixture<SystemTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
