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
  selector: 'ui-search-dropdown',
  templateUrl: './search-dropdown.component.html',
  styleUrls: ['./search-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchDropdownComponent {
  @Input()
  public sourceUrls: string[] = [];

  @Output()
  public itemSelected = new EventEmitter<ITodo>();

  public showsAutocomplete$ = new BehaviorSubject<boolean>(false);
  public selectedValue$ = new BehaviorSubject<string>('Select Item');

  constructor() {}

  onItemSelected(item: ITodo) {
    this.selectedValue$.next(item.title);
    this.showsAutocomplete$.next(false);

    this.itemSelected.emit(item);
  }

  closeAutocomplete() {
    this.showsAutocomplete$.next(false);
  }

  public showAutocomplete(event: MouseEvent) {
    event.stopPropagation();
    this.showsAutocomplete$.next(true);
  }

}
