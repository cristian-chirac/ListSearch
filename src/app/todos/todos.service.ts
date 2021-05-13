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
  public allTodosUrl = 'https://jsonplaceholder.typicode.com/todos';

  public todos$ = this.http.get<ITodo[]>(this.allTodosUrl).pipe(
    map(data => data.map(({title}) => ({title}))),
    catchError(this.handleError),
  );

  constructor(private http: HttpClient) {}

  private handleError(response: HttpErrorResponse): Observable<never> {
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
