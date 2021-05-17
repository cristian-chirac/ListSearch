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

import {
    Observable,
    of,
    Subject,
} from 'rxjs';

import { ITodo } from './models/Todo';
import { EmphasizePatternPipe } from './pipes/emphasize-pattern.pipe';
import { TodosSearchFilterPipe } from './pipes/todos-search-filter.pipe';
import { TodosComponent } from './todos.component';
import { TodosService } from './todos.service';

describe('TodosComponent', () => {
  const TODOS_DELECTUS_1 = "delectus aut autem";
  const TODOS_DELECTUS_2 = "veritatis pariatur delectus";
  const RESULTS_TODOS_DATA = [
    TODOS_DELECTUS_1,
    TODOS_DELECTUS_2,
  ].map(todoText => ({title: todoText}));

  const SEARCH_INPUT = "delectus";

  let component: TodosComponent;
  let fixture: ComponentFixture<TodosComponent>;
  let mockTodosService: {
    getFilteredTodos: (filterToken: string) => Observable<ITodo[]>
  };

  beforeEach(async () => {
    // Service tests filtering of todos, so can mock the filtered result directly
    mockTodosService = {
      getFilteredTodos: (_) => of(RESULTS_TODOS_DATA),
    };

    await TestBed.configureTestingModule({
      declarations: [
        TodosComponent,
        EmphasizePatternPipe,
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

  it('should update view model on programatic input change', async (done) => {
    component.results$.subscribe(values => {
      expect(values).toEqual(RESULTS_TODOS_DATA);
      done();
    });

    component.search.setValue(SEARCH_INPUT);
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

    searchInput.nativeElement.value = SEARCH_INPUT;
    searchInput.nativeElement.dispatchEvent(EventGenerator.input());
  });
});
