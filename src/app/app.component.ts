import { Component } from '@angular/core';

import { ITodo } from './todos/models/Todo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
  // not really needed here, but always use OnPush
})
export class AppComponent {
  // is is unused
  public title = 'ListSearch';

  // usually, component is only concerned with the service, urls should be in a service
  public todoUrls = [
    'https://jsonplaceholder.typicode.com/todos',
    'https://jsonplaceholder.typicode.com/posts',
  ];

  // on*Action-Type* event handlers are not great practice, use descriptive names if possible. someting like "logTodo" here.
  public onItemSelected(item: ITodo) {
    console.log(`Selected todo: ${item.title}.`);
  }
}
