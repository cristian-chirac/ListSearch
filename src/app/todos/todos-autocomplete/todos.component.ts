import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    Output,
    QueryList,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import {
    BehaviorSubject,
    Observable,
    Subject,
} from 'rxjs';
import {
    catchError,
    debounceTime,
    map,
    startWith,
    switchMap,
    takeUntil,
    tap,
    withLatestFrom,
} from 'rxjs/operators';
import { KEY_NAMES } from 'src/app/common/constants/keyboard_utils';
import { EMPTY_TODO } from 'src/app/common/constants/todos_utils';

import { ITodo } from '../models/Todo';
import { TodosService } from './todos.service';

@Component({
    selector: 'ui-todos-autocomplete',
    templateUrl: './todos.component.html',
    styleUrls: ['./todos.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosComponent implements AfterViewInit, OnDestroy {
    @Input()
    public selectedTodo: ITodo = EMPTY_TODO;

    @Output()
    public itemSelected = new EventEmitter<ITodo>();
    @Output()
    public close = new EventEmitter<void>();

    @ViewChild('searchBarInput', { static: true })
    public searchBarInput!: ElementRef;
    @ViewChildren('todos')
    public todosListViewElements!: QueryList<ElementRef>;

    public search = new FormControl('');
    public searchText$ = this.search.valueChanges;
    public focusSuggestionIndexAction$: Observable<number>;

    public results$ = this.searchText$.pipe(
        startWith(''),
        debounceTime(100),
        switchMap(searchString => this._todosService.getFilteredTodos(searchString)),
        map(({ filteredTodos }) => filteredTodos),
        tap(todos => {
            const selectedTodoIndex = todos.findIndex(todo => todo.id === this.selectedTodo.id);
            this._focusSuggestionIndex$.next(selectedTodoIndex);
        }),
        catchError(() => []),
    );

    private _focusSuggestionIndex$ = new BehaviorSubject<number>(-1);
    private _focusSuggestionArrowMove$ = new Subject<
        typeof KEY_NAMES.ARROW_UP |
        typeof KEY_NAMES.ARROW_DOWN
    >();

    private _destroyed$ = new Subject();
    private _focusSuggestionEnter$ = new Subject<void>();

    constructor(private _todosService: TodosService) {
        this.focusSuggestionIndexAction$ = this._focusSuggestionIndex$.asObservable();

        this._focusSuggestionArrowMove$.pipe(
            withLatestFrom(
                this.results$.pipe(map(results => results.length)),
            ),
            tap(([arrowKey, resultsLength]) => {
                const direction = arrowKey === KEY_NAMES.ARROW_DOWN ? 1 : -1;
                const newIndex = this._focusSuggestionIndex$.value + direction;

                if (newIndex < 0 || newIndex >= resultsLength) {
                    return;
                }

                this._focusSuggestionIndex$.next(newIndex);
            }),
            takeUntil(this._destroyed$),
        ).subscribe();

        this._focusSuggestionEnter$.pipe(
            withLatestFrom(
                this.results$,
            ),
            tap(([_, todos]) => this.itemSelected.emit(todos[this._focusSuggestionIndex$.value])),
            takeUntil(this._destroyed$),
        ).subscribe();
    }

    ngAfterViewInit(): void {
        this.searchBarInput.nativeElement.focus();

        this._focusSuggestionIndex$.pipe(
            withLatestFrom(this.todosListViewElements.changes),
            tap(([suggestionIndex, resultsElems]) => {
                const suggestionElem = resultsElems.toArray()[suggestionIndex];
                suggestionElem?.nativeElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                    inline: 'nearest',
                });
            }),
            takeUntil(this._destroyed$),
        ).subscribe();
    }

    ngOnDestroy() {
        this._destroyed$.next();
    }

    public todoSelectedHandler(item: ITodo) {
        this.itemSelected.emit(item);
    }

    @HostListener('window:keyup', ['$event'])
    public keyEvent(event: KeyboardEvent) {
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
