import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PledgeDialogComponent } from './pledge-dialog.component';

describe('PledgeDialogComponent', () => {
  let component: PledgeDialogComponent;
  let fixture: ComponentFixture<PledgeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PledgeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PledgeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
