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
    skip,
    startWith,
} from 'rxjs/operators';
import { TODOS_URLS } from 'src/app/common/constants/data_utils';

import {
    IFilteredTodos,
    ITodo,
} from '../models/Todo';

@Injectable({
    providedIn: 'root',
})
export class TodosService {
    constructor(private _http: HttpClient) { }

    public getFilteredTodos(filterToken: string): Observable<IFilteredTodos> {
        return combineLatest(TODOS_URLS.map(
            this._getTodos,
        )).pipe(
            skip(1),
            map(todosLists => ({
                filterToken,
                filteredTodos: ([] as ITodo[])
                    .concat(...todosLists)
                    .filter(todo => !filterToken || todo.title.includes(filterToken))
            })),

        );
    }

    private _getTodos = (url: string): Observable<ITodo[]> => {
        return this._http.get<ITodo[]>(url).pipe(
            startWith([] as ITodo[]),
            map(data => data.map(({ title, id }) => ({
                title,
                id: `${url}:${id}`,
            } as ITodo))),
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
