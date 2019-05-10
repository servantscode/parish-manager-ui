import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScSearchBarComponent } from './sc-search-bar.component';

describe('ScSearchBarComponent', () => {
  let component: ScSearchBarComponent;
  let fixture: ComponentFixture<ScSearchBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScSearchBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
