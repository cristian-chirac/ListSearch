export interface ITodo {
    id: string;
    title: string;
}

export interface IFilteredTodos {
    filterToken: string;
    filteredTodos: ITodo[];
}
