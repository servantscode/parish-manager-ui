import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkSessionDialogComponent } from './link-session-dialog.component';

describe('LinkSessionDialogComponent', () => {
  let component: LinkSessionDialogComponent;
  let fixture: ComponentFixture<LinkSessionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkSessionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkSessionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
