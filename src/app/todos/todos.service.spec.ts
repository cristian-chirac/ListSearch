import { HttpErrorResponse } from '@angular/common/http';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TodosService } from './todos.service';

describe('TodosService', () => {
  let service: TodosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
    });

    service = TestBed.inject(TodosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should extract titles from http response', () => {
    const TITLE_0 = "delectus aut autem";
    const TITLE_1 = "quis ut nam facilis et officia qui";

    service.todos$.subscribe(result => {
      expect(result.length).toBe(2);
      expect(result[0].title === TITLE_0 && result[1].title === TITLE_1);
    });

    httpMock.expectOne({
      method: 'GET',
      url: service.allTodosUrl
    }).flush([
      {
        "userId": 1,
        "id": 1,
        "title": TITLE_0,
        "completed": false
      },
      {
        "userId": 1,
        "id": 2,
        "title": TITLE_1,
        "completed": false
      }
    ]);
  });

  it('should throwError on todos ErrorEvent', () => {
    const ERROR_MSG = 'Some error occured';

    service.todos$.subscribe({
      error(result: string) {
        expect(result).toContain(ERROR_MSG);
      }
    });

    httpMock.expectOne({
      method: 'GET',
      url: service.allTodosUrl
    }).error(new ErrorEvent('error', {
      error: {
        message: ERROR_MSG,
      },
    }));
  });

  it('should throwError on todos error response', () => {
    const ERROR_MSG = 'Some error occured';

    service.todos$.subscribe({
      error(result: string) {
        expect(result).toContain(ERROR_MSG);
      }
    });

    httpMock.expectOne({
      method: 'GET',
      url: service.allTodosUrl
    }).flush({}, {
      status: 404,
      statusText: ERROR_MSG,
    })
  });
});
