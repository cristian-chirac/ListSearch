import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Output,
} from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { EMPTY_TODO } from 'src/app/common/constants/todos_utils';

import { ITodo } from '../models/Todo';

@Component({
    selector: 'ui-search-dropdown',
    templateUrl: './search-dropdown.component.html',
    styleUrls: ['./search-dropdown.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchDropdownComponent {
    @Output()
    public itemSelected = new EventEmitter<ITodo>();

    public showsAutocomplete$ = new BehaviorSubject(false);
    public selectedValue$ = new BehaviorSubject<ITodo>(EMPTY_TODO);

    constructor() { }

    public onItemSelected(item: ITodo) {
        this.selectedValue$.next(item);
        this.showsAutocomplete$.next(false);

        this.itemSelected.emit(item);
    }

    public closeAutocomplete() {
        this.showsAutocomplete$.next(false);
    }

    public showAutocomplete(event?: MouseEvent) {
        event?.stopPropagation();
        this.showsAutocomplete$.next(true);
    }

}
