import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceBr',
})
export class ReplaceBrPipe implements PipeTransform {
  transform(value: string, replaceBr: boolean): string {
    if (!replaceBr) {
      return value;
    }

    return value.replace(/<br\s*\/?>/gi, ' ');
  }
}
