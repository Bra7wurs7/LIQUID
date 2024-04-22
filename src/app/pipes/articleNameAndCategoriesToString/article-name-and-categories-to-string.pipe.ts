import { Pipe, PipeTransform } from '@angular/core';
import { Article } from '../../models/article';

@Pipe({
  name: 'articleNameAndCategoriesToString',
  standalone: true
})
export class ArticleNameAndCategoriesToStringPipe implements PipeTransform {

  transform(value: Article): unknown {
    let str = value.name; 
    for (const group of value.groups) {
      str += ` #${group}`
    }
    return str;
  }

}
