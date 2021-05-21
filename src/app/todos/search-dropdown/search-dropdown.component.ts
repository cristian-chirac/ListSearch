import {
    ChangeDetectionStrategy,
    Component,
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
  public todoUrls = [
    'https://jsonplaceholder.typicode.com/todos',
    'https://jsonplaceholder.typicode.com/posts',
  ];

  public showsAutocomplete$ = new BehaviorSubject<boolean>(false);
  public selectedValue$ = new BehaviorSubject<string>("Select Item");

  constructor() {}

  onItemSelected(item: ITodo) {
    this.selectedValue$.next(item.title);
    this.showsAutocomplete$.next(false);
  }

  closeAutocomplete() {
    this.showsAutocomplete$.next(false);
  }

  public showAutocomplete(event: MouseEvent) {
    event.stopPropagation();
    this.showsAutocomplete$.next(true);
  }

}
