import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { TodosSearchFilterPipe } from './pipes/todos-search-filter.pipe';
import { TodosComponent } from './todos.component';
import { EmphasizePatternPipe } from './pipes/emphasize-pattern.pipe';
import { UiNgLetModule } from '@uipath/angular/directives/ui-ng-let';

@NgModule({
  declarations: [
    TodosComponent,
    TodosSearchFilterPipe,
    EmphasizePatternPipe,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    HttpClientModule,
    UiNgLetModule,
  ],
  exports: [
    TodosComponent,
  ]
})
export class TodosModule { }
