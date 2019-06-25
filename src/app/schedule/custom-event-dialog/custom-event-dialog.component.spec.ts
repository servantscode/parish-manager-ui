import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomEventDialogComponent } from './custom-event-dialog.component';

describe('CustomEventDialogComponent', () => {
  let component: CustomEventDialogComponent;
  let fixture: ComponentFixture<CustomEventDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomEventDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
