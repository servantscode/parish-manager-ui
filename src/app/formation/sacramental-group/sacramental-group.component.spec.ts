import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SacramentalGroupComponent } from './sacramental-group.component';

describe('SacramentalGroupComponent', () => {
  let component: SacramentalGroupComponent;
  let fixture: ComponentFixture<SacramentalGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SacramentalGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SacramentalGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
