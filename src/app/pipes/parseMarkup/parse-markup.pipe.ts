import { Pipe, PipeTransform } from '@angular/core';
import * as marked from 'marked';

@Pipe({
  name: 'parseMarkup'
})
export class ParseMarkupPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return this.parseInternalLinks(marked(value));
  }

  parseInternalLinks(htmlMarkdownString: string): string {
    return htmlMarkdownString.replace(new RegExp('\\[\\[[^\\[]*\\]\\]','g'), '<span class="internalLink">$&</span>')
  }
}
