import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'urlDomain',
  standalone: true
})
export class UrlDomainPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    const url = new URL(value);
    return url.host;
  }

}
