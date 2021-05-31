import { ITodo } from 'src/app/todos/models/Todo';

export const EMPTY_TODO: ITodo = {
    id: '',
    title: '',
} as const;
