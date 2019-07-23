import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditViewPage } from './edit-view.page';

describe('EditViewPage', () => {
  let component: EditViewPage;
  let fixture: ComponentFixture<EditViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditViewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
