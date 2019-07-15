import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreComponent } from './more.component';

describe('MoreComponent', () => {
  let component: MoreComponent;
  let fixture: ComponentFixture<MoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
