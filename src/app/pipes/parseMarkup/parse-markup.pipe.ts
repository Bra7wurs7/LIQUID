import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Pipe({
  name: 'parseMarkup'
})
export class ParseMarkupPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, ...args: unknown[]): SafeHtml {
    return this.parseInternalLinks(marked(value));
  }

  parseInternalLinks(htmlMarkdownString: string): SafeHtml {
    this.sanitizer.sanitize(0, htmlMarkdownString)
    const md = htmlMarkdownString.replace(new RegExp('\\[\\[[^\\[]*\\]\\]','g'), '<span onclick="internalLinkOpener.value=\'$&\'; internalLinkOpener.click()" class="internalLink">$&</span>')
    const safe = this.sanitizer.bypassSecurityTrustHtml(md);
    return safe;
  }
}
