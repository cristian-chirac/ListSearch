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
} from 'rxjs';
import {
    catchError,
    debounceTime,
    map,
    tap,
} from 'rxjs/operators';

import { TodosService } from './todos.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosComponent implements OnInit {
  public search = new FormControl('');
  public placeholder = "Type here to search";

  private errorMessageSubject = new BehaviorSubject<string>("");
  public errorMessageAction$ = this.errorMessageSubject.asObservable();

  private searchInputDelayed$ = this.search.valueChanges.pipe(debounceTime(100));

  public viewModel$ = combineLatest([
    this.todosService.todos$,
    this.searchInputDelayed$,
  ]).pipe(
    map(([todos, searchInput]) => ({todos, searchInput})),
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  constructor(private todosService: TodosService) { }

  ngOnInit(): void {}

}
