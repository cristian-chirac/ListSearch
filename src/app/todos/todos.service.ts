import {
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  combineLatest,
  Observable,
  throwError,
} from 'rxjs';
import {
  catchError,
  map,
  startWith,
} from 'rxjs/operators';

import { ITodo } from './models/Todo';

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  private _todosUrls = [
    'https://jsonplaceholder.typicode.com/todos',
    'https://jsonplaceholder.typicode.com/posts',
  ];

  constructor(private _http: HttpClient) { }

  public getFilteredTodos(filterToken: string): Observable<ITodo[]> {
    return combineLatest(this._todosUrls.map(
      this._getTodos
    )).pipe(
      map(todosLists => ([] as ITodo[])
        .concat(...todosLists)
        .filter(todo => filterToken && todo.title.includes(filterToken))),
    );
  }

  private _getTodos = (url: string): Observable<ITodo[]> => {
    return this._http.get<ITodo[]>(url).pipe(
      startWith([] as ITodo[]),
      map(data => data.map(({ title }) => ({ title } as ITodo))),
      catchError(this._handleError),
    );
  }

  private _handleError(response: HttpErrorResponse): Observable<never> {
    let errorMessage = '';

    if (response.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${response.error.error.message}`;
    } else {
      errorMessage = `Server returned code: ${response.status}, error message is: ${response.message}`;
    }
    console.error(errorMessage);

    return throwError(errorMessage);
  }
}
