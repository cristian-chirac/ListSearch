import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs';
import { last } from 'rxjs/operators';

import { ITodo } from '../models/Todo';
import { TodosService } from './todos.service';

describe('TodosService', () => {
  const DUMMY_URLS = [
    "/my/url/1",
    "/my/url/2",
  ];

  let service: TodosService;
  let httpMock: HttpTestingController;
  let getTodos: (url: string) => Observable<ITodo[]>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
    });

    service = TestBed.inject(TodosService);
    httpMock = TestBed.inject(HttpTestingController);

    getTodos = service["_getTodos"].bind(service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should extract titles from http response', () => {
    const TITLE_0 = "delectus aut autem";
    const TITLE_1 = "quis ut nam facilis et officia qui";

    getTodos(DUMMY_URLS[0]).pipe(last()).subscribe(result => {
      expect(result).toEqual([
        {title: TITLE_0},
        {title: TITLE_1},
      ]);
    });

    httpMock.expectOne({
      method: 'GET',
      url: DUMMY_URLS[0]
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

    getTodos(DUMMY_URLS[0]).subscribe({
      error(result: string) {
        expect(result).toContain(ERROR_MSG);
      }
    });

    httpMock.expectOne({
      method: 'GET',
      url: DUMMY_URLS[0]
    }).error(new ErrorEvent('error', {
      error: {
        message: ERROR_MSG,
      },
    }));
  });

  it('should throwError on todos error response', () => {
    const ERROR_MSG = 'Some error occured';

    getTodos(DUMMY_URLS[0]).subscribe({
      error(result: string) {
        expect(result).toContain(ERROR_MSG);
      }
    });

    httpMock.expectOne({
      method: 'GET',
      url: DUMMY_URLS[0]
    }).flush({}, {
      status: 404,
      statusText: ERROR_MSG,
    });
  });

  it('should return all todos on empty filterToken', () => {
    const TITLE_0 = "delectus aut autem";
    const TITLE_1 = "quis ut nam facilis et officia qui";

    service.getFilteredTodos('', DUMMY_URLS).pipe(last()).subscribe({
      next(value) {
        expect(value).toEqual({
          filterToken: '',
          filteredTodos: [
            {title: TITLE_0},
            {title: TITLE_1},
          ]
        });
      }
    });

    httpMock.expectOne({
      method: 'GET',
      url: DUMMY_URLS[0]
    }).flush([
      {
        "userId": 1,
        "id": 1,
        "title": TITLE_0,
        "completed": false
      },
    ]);

    httpMock.expectOne({
      method: 'GET',
      url: DUMMY_URLS[1]
    }).flush([
      {
        "userId": 1,
        "id": 2,
        "title": TITLE_1,
        "completed": false
      }
    ]);
  });

  it('should return filtered todos on non-empty filterToken', () => {
    const TITLE_0 = "delectus aut autem";
    const TITLE_1 = "quis ut nam facilis et officia qui";
    const FILTER_TOKEN = "quis";

    service.getFilteredTodos(FILTER_TOKEN, DUMMY_URLS).pipe(last()).subscribe({
      next(value) {
        expect(value).toEqual({
          filterToken: FILTER_TOKEN,
          filteredTodos: [{title: TITLE_1}],
        });
      }
    });

    httpMock.expectOne({
      method: 'GET',
      url: DUMMY_URLS[0]
    }).flush([
      {
        "userId": 1,
        "id": 1,
        "title": TITLE_0,
        "completed": false
      },
    ]);

    httpMock.expectOne({
      method: 'GET',
      url: DUMMY_URLS[1]
    }).flush([
      {
        "userId": 1,
        "id": 2,
        "title": TITLE_1,
        "completed": false
      }
    ]);
  });
});
