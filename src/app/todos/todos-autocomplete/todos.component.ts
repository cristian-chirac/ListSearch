import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import {
    BehaviorSubject,
    Observable,
} from 'rxjs';
import {
    catchError,
    debounceTime,
    filter,
    switchMap,
    tap,
} from 'rxjs/operators';

import { ITodo } from '../models/Todo';
import { TodosService } from './todos.service';

@Component({
  selector: 'todos-autocomplete',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosComponent {
  @Input() sourceUrls: string[] = [];

  @Output() itemSelected = new EventEmitter<ITodo>();

  public search = new FormControl('');
  public errorMessageAction$: Observable<string>;

  public searchText$ = this.search.valueChanges;
  public searchValueAction$ = new BehaviorSubject<string>('');

  public results$ = this.searchValueAction$.pipe(
    tap(() => this._errorMessage$.next('')),
    debounceTime(100),
    switchMap(searchString => this._todosService.getFilteredTodos(searchString, this.sourceUrls)),
    filter(values => values.length > 0),
    catchError(err => {
      this._errorMessage$.next(err);
      return [];
    })
  );

  private _errorMessage$ = new BehaviorSubject<string>('');

  constructor(private _todosService: TodosService) {
    this.errorMessageAction$ = this._errorMessage$.asObservable();

    this.searchText$.subscribe({
      next: (value) => this.searchValueAction$.next(value)
    });
  }

  public todoSelectedHandler(item: ITodo) {
    this.itemSelected.emit(item);
  }

}
