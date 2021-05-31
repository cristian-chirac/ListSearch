import {
    ChangeDetectionStrategy,
    Component,
} from '@angular/core';

import { ITodo } from './todos/models/Todo';

@Component({
    selector: 'ui-app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    public logTodo(item: ITodo) {
        console.log(`Selected todo: ${item.title}.`);
    }

    public logSelectionCleared() {
        console.log('Todo selection cleared!');
    }
}
