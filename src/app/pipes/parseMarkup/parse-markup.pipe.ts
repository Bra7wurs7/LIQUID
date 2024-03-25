import { Pipe, PipeTransform } from '@angular/core';
import MarkdownIt from 'markdown-it';



@Pipe({
  name: 'parseMarkup'
})
export class ParseMarkupPipe implements PipeTransform {
  md = new MarkdownIt();
  transform(value: string, ...args: unknown[]): string {
    return this.md.render(value);
  }
}
