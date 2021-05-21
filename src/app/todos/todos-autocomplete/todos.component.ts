import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
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
    map,
    startWith,
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
export class TodosComponent implements AfterViewInit {
  @Input() sourceUrls: string[] = [];

  @Output() itemSelected = new EventEmitter<ITodo>();

  @ViewChild('searchBarInput', {static: true}) searchBarInput!: ElementRef;

  public search = new FormControl('');
  public errorMessageAction$: Observable<string>;

  public searchText$ = this.search.valueChanges;

  public results$ = this.searchText$.pipe(
    startWith(''),
    tap(() => this._errorMessage$.next('')),
    debounceTime(100),
    switchMap(searchString => this._todosService.getFilteredTodos(searchString, this.sourceUrls)),
    map(({filteredTodos}) => filteredTodos),
    catchError(err => {
      this._errorMessage$.next(err);
      return [];
    })
  );

  private _errorMessage$ = new BehaviorSubject<string>('');

  constructor(private _todosService: TodosService) {
    this.errorMessageAction$ = this._errorMessage$.asObservable();
  }

  ngAfterViewInit(): void {
    this.searchBarInput.nativeElement.focus();
  }

  public todoSelectedHandler(item: ITodo) {
    this.itemSelected.emit(item);
  }

}
