import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountViewPage } from './account-view.page';

describe('AccountViewPage', () => {
  let component: AccountViewPage;
  let fixture: ComponentFixture<AccountViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountViewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
