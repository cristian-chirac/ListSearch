import { TodosSearchFilterPipe } from './todos-search-filter.pipe';

describe('TodosSearchFilterPipe', () => {
  // Pipe is pure, can instantiate once and test the transform function directly
  const pipe = new TodosSearchFilterPipe();

  const TODOS_DELECTUS_1 = "delectus aut autem";
  const TODOS_DELECTUS_2 = "veritatis pariatur delectus";
  const TODOS_NON_DELECTUS = "quis ut nam facilis et officia qui";

  const DELECTUS_SEARCH_INPUT = "delectus";

  const TODOS_DATA = [
    TODOS_DELECTUS_1,
    TODOS_NON_DELECTUS,
    TODOS_DELECTUS_2,
  ].map(todoText => ({title: todoText}));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('returns no results when search input is empty', () => {
    expect(pipe.transform(TODOS_DATA, '')).toEqual([]);
  });

  it('returns no results when data set is empty', () => {
    expect(pipe.transform([], DELECTUS_SEARCH_INPUT)).toEqual([]);
  });

  it('returns filtered data based on search string', () => {
    expect(pipe.transform(TODOS_DATA, DELECTUS_SEARCH_INPUT)).toEqual([
      TODOS_DELECTUS_1,
      TODOS_DELECTUS_2,
    ].map(todo => ({title: todo})));
  });
});
