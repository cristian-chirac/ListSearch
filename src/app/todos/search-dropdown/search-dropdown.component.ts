import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { ITodo } from '../models/Todo';

@Component({
  selector: 'search-dropdown',
  templateUrl: './search-dropdown.component.html',
  styleUrls: ['./search-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchDropdownComponent {
  @Input() sourceUrls: string[] = [];

  @Output() itemSelected = new EventEmitter<ITodo>();

  // "<boolean>" is redundant
  public showsAutocomplete$ = new BehaviorSubject<boolean>(false);

  // not the best idea to use the title as identifier since "Select Item" might be an actual item name. Maybe use an id instead
  // bonus: how would you add functionality to deselect the current item?
  public selectedValue$ = new BehaviorSubject<string>("Select Item");

  constructor() { }

  onItemSelected(item: ITodo) {
    this.selectedValue$.next(item.title);
    this.showsAutocomplete$.next(false);

    this.itemSelected.emit(item);
  }

  closeAutocomplete() {
    this.showsAutocomplete$.next(false);
  }

  public showAutocomplete(event: MouseEvent) {
    // I cannot show the autocomplete by keyboard navigation
    event.stopPropagation();
    this.showsAutocomplete$.next(true);
  }

}
