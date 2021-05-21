export interface ITodo {
  title: string;
}

export interface IFilteredTodos {
  filterToken: string;
  filteredTodos: ITodo[];
}
