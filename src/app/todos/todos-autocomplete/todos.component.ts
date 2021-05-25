import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subject,
  Subscription,
} from 'rxjs';
import {
  catchError,
  debounceTime,
  filter,
  map,
  startWith,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { KEY_NAMES } from 'src/app/common/constants/keyboard_utils';

import { ITodo } from '../models/Todo';
import { TodosService } from './todos.service';

@Component({
  selector: 'todos-autocomplete',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosComponent implements AfterViewInit, OnDestroy {
  @Input() sourceUrls: string[] = [];

  @Output() itemSelected = new EventEmitter<ITodo>();
  @Output() close = new EventEmitter<void>();

  @ViewChild('searchBarInput', { static: true }) searchBarInput!: ElementRef;
  // any is strogly discouraged especially if accessing members on the object (line 123)
  @ViewChildren('todos') todosListViewElements!: QueryList<any>;

  public search = new FormControl('');
  // unused
  public errorMessageAction$: Observable<string>;
  public searchText$ = this.search.valueChanges;
  public focusSuggestionIndexAction$: Observable<number>;

  public results$ = this.searchText$.pipe(
    startWith(''),
    tap(() => this._errorMessage$.next('')),
    debounceTime(100),
    switchMap(searchString => this._todosService.getFilteredTodos(searchString, this.sourceUrls)),
    map(({ filteredTodos }) => filteredTodos),
    catchError(err => {
      this._errorMessage$.next(err);
      return [];
    })
  );

  // unused
  private _errorMessage$ = new BehaviorSubject<string>('');
  private _focusSuggestionIndex$ = new BehaviorSubject<number>(-1);
  private _focusSuggestionArrowMove$ = new Subject<
    typeof KEY_NAMES.ARROW_UP |
    typeof KEY_NAMES.ARROW_DOWN
  >();

  // we use the takeUntil(destroyed$) pattern to avoid storing the subscriptions
  private _focusSuggestionArrowMoveSubscription: Subscription;
  private _focusSuggestionScrollToSubscription!: Subscription;
  private _focusSuggestionEnter$ = new Subject<void>();
  private _focusSuggestionEnterSubscription!: Subscription;

  constructor(private _todosService: TodosService) {
    this.errorMessageAction$ = this._errorMessage$.asObservable();
    this.focusSuggestionIndexAction$ = this._focusSuggestionIndex$.asObservable();

    this._focusSuggestionArrowMoveSubscription = this._focusSuggestionArrowMove$.pipe(
      withLatestFrom( // no real need for withLatestFrom, you may also simply use this.results$.value / this._focusSuggestionIndex$.value
        this.results$.pipe(map(results => results.length)),
        this._focusSuggestionIndex$,
      ),
      tap(([arrowKey, resultsLength, currFocusIndex]) => {
        const direction = arrowKey === KEY_NAMES.ARROW_DOWN ? 1 : -1;
        const newIndex = currFocusIndex + direction;

        if (newIndex < 0 || newIndex >= resultsLength) {
          return;
        }

        this._focusSuggestionIndex$.next(newIndex);
      }),
    ).subscribe();

    this._focusSuggestionEnterSubscription = this._focusSuggestionEnter$.pipe(
      withLatestFrom( // same as above
        this.results$,
        this._focusSuggestionIndex$
      ),
      tap(([_, todos, selectedTodoIndex]) => this.itemSelected.emit(todos[selectedTodoIndex])),
    ).subscribe();
  }

  ngAfterViewInit(): void {
    this.searchBarInput.nativeElement.focus();

    this._focusSuggestionScrollToSubscription = this._focusSuggestionIndex$.pipe(
      withLatestFrom(this.todosListViewElements.changes),
      tap(([suggestionIndex, resultsElems]) => {
        const suggestionElem = resultsElems.toArray()[suggestionIndex];
        suggestionElem.nativeElement.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest"
        });
      }),
    ).subscribe();
  }

  // no need for :void
  ngOnDestroy(): void {
    this._focusSuggestionArrowMoveSubscription.unsubscribe();
    this._focusSuggestionEnterSubscription.unsubscribe();
    this._focusSuggestionScrollToSubscription.unsubscribe();
  }

  public todoSelectedHandler(item: ITodo) {
    this.itemSelected.emit(item);
  }

  @HostListener('window:keyup', ['$event'])
  private keyEvent(event: KeyboardEvent) {
    switch (event.key) {
      case KEY_NAMES.ESCAPE:
        this.close.emit();
        break;
      case KEY_NAMES.ARROW_DOWN:
      case KEY_NAMES.ARROW_UP:
        this._focusSuggestionArrowMove$.next(event.key);
        break;
      case KEY_NAMES.ENTER:
        this._focusSuggestionEnter$.next();
        break;
    }
  }

}
