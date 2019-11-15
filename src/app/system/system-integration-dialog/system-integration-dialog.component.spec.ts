import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemIntegrationDialogComponent } from './system-integration-dialog.component';

describe('SystemIntegrationDialogComponent', () => {
  let component: SystemIntegrationDialogComponent;
  let fixture: ComponentFixture<SystemIntegrationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemIntegrationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemIntegrationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
