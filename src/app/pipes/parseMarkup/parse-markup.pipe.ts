import { Pipe, PipeTransform } from '@angular/core';
import * as marked from 'marked';

@Pipe({
  name: 'parseMarkup'
})
export class ParseMarkupPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return marked(value as string);
  }

}
