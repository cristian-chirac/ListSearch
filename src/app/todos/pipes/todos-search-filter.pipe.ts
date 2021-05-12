import {
    Pipe,
    PipeTransform,
} from '@angular/core';

import { ITodo } from '../models/Todo';

@Pipe({
  name: 'todosSearchFilter'
})
export class TodosSearchFilterPipe implements PipeTransform {

  transform(todos: ITodo[], searchInput: string): ITodo[] {
    if (!searchInput) return [];
    return todos.filter(todo => todo.title.includes(searchInput));
  }

}
