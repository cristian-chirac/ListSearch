import {
    ChangeDetectionStrategy,
    Component,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import {
    BehaviorSubject,
    Observable,
} from 'rxjs';
import {
    catchError,
    debounceTime,
    switchMap,
    tap,
} from 'rxjs/operators';

import { TodosService } from './todos.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosComponent {
  public search = new FormControl('');
  public errorMessageAction$: Observable<string>;

  public results$ = this.search.valueChanges.pipe(
    tap(() => this._errorMessage$.next('')),
    debounceTime(100),
    switchMap(searchString => this._todosService.getFilteredTodos(searchString)),
    catchError(err => {
      this._errorMessage$.next(err);
      return [];
    })
  );

  private _errorMessage$ = new BehaviorSubject<string>('');

  constructor(private _todosService: TodosService) {
    this.errorMessageAction$ = this._errorMessage$.asObservable();
  }
}
