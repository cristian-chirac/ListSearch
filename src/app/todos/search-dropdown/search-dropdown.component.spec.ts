import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';

import { ITodo } from '../models/Todo';
import { SearchDropdownComponent } from './search-dropdown.component';

describe('SearchDropdownComponent', () => {
  let component: SearchDropdownComponent;
  let fixture: ComponentFixture<SearchDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchDropdownComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close autocomplete and emit item when selected', () => {
    // GIVEN
    const todoItem: ITodo = {
        id: '1',
        title: 'my title',
    };
    spyOn(component.itemSelected, 'emit');

    // WHEN
    component.onItemSelected(todoItem);

    // THEN
    expect(component.showsAutocomplete$.value).toBe(false);
    expect(component.selectedValue$.value).toEqual(todoItem);
    expect(component.itemSelected.emit).toHaveBeenCalledOnceWith(todoItem);
  });

  it('should update "close autocomplete" subject on close handler', () => {
      // WHEN
    component.closeAutocomplete();

    // THEN
    expect(component.showsAutocomplete$.value).toBe(false);
  });

  it('should update "show autocomplete" subject on show handler', () => {
    // WHEN
  component.showAutocomplete();

  // THEN
  expect(component.showsAutocomplete$.value).toBe(true);
});
});
