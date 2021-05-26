import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { UiNgLetModule } from '@uipath/angular/directives/ui-ng-let';

import { ClickOutsideDirective } from './click-outside.directive';
import { EmphasizePatternPipe } from './pipes/emphasize-pattern.pipe';
import { TodosSearchFilterPipe } from './pipes/todos-search-filter.pipe';
import { SearchDropdownComponent } from './search-dropdown/search-dropdown.component';
import { TodosComponent } from './todos-autocomplete/todos.component';

@NgModule({
  declarations: [
    TodosComponent,
    TodosSearchFilterPipe,
    EmphasizePatternPipe,
    ClickOutsideDirective,
    SearchDropdownComponent,
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
    SearchDropdownComponent,
  ],
})
export class TodosModule { }
