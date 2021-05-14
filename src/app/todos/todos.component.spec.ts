import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';
import {
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { EventGenerator } from '@uipath/angular/testing';

import { Subject } from 'rxjs';

import { ITodo } from './models/Todo';
import { TodosSearchFilterPipe } from './pipes/todos-search-filter.pipe';
import { TodosComponent } from './todos.component';
import { TodosService } from './todos.service';

describe('TodosComponent', () => {
  const TODOS_DELECTUS_1 = "delectus aut autem";
  const TODOS_DELECTUS_2 = "veritatis pariatur delectus";
  const TODOS_NON_DELECTUS = "quis ut nam facilis et officia qui";

  const DELECTUS_SEARCH_INPUT = "delectus";

  const TODOS_DATA = [
    TODOS_DELECTUS_1,
    TODOS_NON_DELECTUS,
    TODOS_DELECTUS_2,
  ].map(todoText => ({title: todoText}));

  const RESULTS_TODOS_DATA = [
    TODOS_DELECTUS_1,
    TODOS_DELECTUS_2,
  ].map(todoText => ({title: todoText}));

  let component: TodosComponent;
  let fixture: ComponentFixture<TodosComponent>;
  let mockTodosService: {todos$: Subject<ITodo[]>};

  beforeEach(async () => {
    mockTodosService = {todos$: new Subject<ITodo[]>()};

    await TestBed.configureTestingModule({
      declarations: [
        TodosComponent,
        TodosSearchFilterPipe,
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: TodosService, useValue: mockTodosService},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  fit('should update view model on programatic input change', async (done) => {
    component.results$.subscribe(values => {
      expect(values).toEqual(RESULTS_TODOS_DATA);
      done();
    });

    mockTodosService.todos$.next(TODOS_DATA);
    component.search.setValue(DELECTUS_SEARCH_INPUT);
  });

  it('should update filtered todos list on user input change', async (done) => {
    const searchInput = fixture.debugElement.query(By.css('[data-testId="search-input"]'));

    component.results$.subscribe(values => {
      expect(values).toEqual(RESULTS_TODOS_DATA);

      fixture.detectChanges();

      const todosListElement = fixture.debugElement.query(By.css('[data-testId="todos-list"]'));
      const todosText = todosListElement.children.map(child => child.nativeElement.innerText);

      expect(todosText).toEqual([
        TODOS_DELECTUS_1,
        TODOS_DELECTUS_2,
      ])

      done();
    });

    mockTodosService.todos$.next(TODOS_DATA);
    searchInput.nativeElement.value = DELECTUS_SEARCH_INPUT;
    searchInput.nativeElement.dispatchEvent(EventGenerator.input());
  });
});
