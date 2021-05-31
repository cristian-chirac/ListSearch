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

    @Output()
    public selectionCleared = new EventEmitter<void>();

    public showsAutocomplete$ = new BehaviorSubject(false);
    public selectedValue$ = new BehaviorSubject<ITodo>(EMPTY_TODO);

    constructor() { }

    public onItemSelected(item: ITodo) {
        this.selectedValue$.next(item);
        this.closeAutocomplete();

        this.itemSelected.emit(item);
    }

    public closeAutocomplete() {
        this.showsAutocomplete$.next(false);
    }

    public showAutocomplete() {
        this.showsAutocomplete$.next(true);
    }

    public clearSelectedValue() {
        this.selectedValue$.next(EMPTY_TODO);
        this.closeAutocomplete();

        this.selectionCleared.emit();
    }

}
