import {
    Pipe,
    PipeTransform,
} from '@angular/core';

@Pipe({
  name: 'emphasizePattern'
})
export class EmphasizePatternPipe implements PipeTransform {

  transform(text: string, pattern: string): string {
    if (!pattern) return text;
    return text.replace(pattern, `<strong>${pattern}</strong>`);
  }

}
