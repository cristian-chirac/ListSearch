import { Component } from '@angular/core';

import { ITodo } from './todos/models/Todo';

@Component({
  selector: 'ui-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public title = 'ListSearch';

  public todoUrls = [
    'https://jsonplaceholder.typicode.com/todos',
    'https://jsonplaceholder.typicode.com/posts',
  ];

  public onItemSelected(item: ITodo) {
    console.log(`Selected todo: ${item.title}.`);
  }
}
