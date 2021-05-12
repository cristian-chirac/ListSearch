import {
    HttpClient,
    HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
    Observable,
    throwError,
} from 'rxjs';
import {
    catchError,
    map,
    tap,
} from 'rxjs/operators';

import { ITodo } from './models/Todo';

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  private allTodosUrl = 'https://jsonplaceholder.typicode.com/todos';

  constructor(private http: HttpClient) {}

  todos$ = this.http.get<ITodo[]>(this.allTodosUrl).pipe(
    map(data => data.map(({title}) => ({title}))),
    catchError(this.handleError),
  );

  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage = '';

    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);

    return throwError(errorMessage);
  }
}
