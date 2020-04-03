import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatechistComponent } from './catechist.component';

describe('CatechistComponent', () => {
  let component: CatechistComponent;
  let fixture: ComponentFixture<CatechistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatechistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatechistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
