import { Pipe, PipeTransform } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Pipe({
  name: 'parseMarkup'
})
export class ParseMarkupPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): SafeHtml {
    return marked(value, {headerIds: false, mangle: false});
  }
}
