import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomAvailabilityDialogComponent } from './room-availability-dialog.component';

describe('RoomAvailabilityDialogComponent', () => {
  let component: RoomAvailabilityDialogComponent;
  let fixture: ComponentFixture<RoomAvailabilityDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomAvailabilityDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomAvailabilityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
