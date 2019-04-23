import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SacramentsComponent } from './sacraments.component';

describe('SacramentsComponent', () => {
  let component: SacramentsComponent;
  let fixture: ComponentFixture<SacramentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SacramentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SacramentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
