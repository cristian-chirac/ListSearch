import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import {
    BehaviorSubject,
    combineLatest,
    EMPTY,
    Subject,
} from 'rxjs';
import {
    catchError,
    debounceTime,
    map,
    takeUntil,
    tap,
} from 'rxjs/operators';

import { TodosService } from './todos.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosComponent implements OnInit, OnDestroy {
  public search = new FormControl('');
  public placeholder = "Type here to search";

  private _destroyed$ = new Subject();

  private _searchInputDelayed$ = this.search.valueChanges.pipe(
    debounceTime(100),
    tap(value => {
      console.log(value);
    }),
    takeUntil(this._destroyed$),
  );

  private _errorMessageSubject = new BehaviorSubject<string>("");
  public errorMessageAction$ = this._errorMessageSubject.asObservable();

  public viewModel$ = combineLatest([
    this._todosService.todos$,
    this._searchInputDelayed$,
  ]).pipe(
    map(([todos, searchInput]) => {
      return ({todos, searchInput});
    }),
    catchError(err => {
      this._errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  constructor(private _todosService: TodosService) {}

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngOnInit(): void {}

}
