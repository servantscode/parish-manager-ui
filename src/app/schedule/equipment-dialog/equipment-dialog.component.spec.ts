import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentDialogComponent } from './equipment-dialog.component';

describe('EquipmentDialogComponent', () => {
  let component: EquipmentDialogComponent;
  let fixture: ComponentFixture<EquipmentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
