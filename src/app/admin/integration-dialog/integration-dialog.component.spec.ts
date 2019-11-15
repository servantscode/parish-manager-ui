import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationDialogComponent } from './integration-dialog.component';

describe('IntegrationDialogComponent', () => {
  let component: IntegrationDialogComponent;
  let fixture: ComponentFixture<IntegrationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntegrationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
