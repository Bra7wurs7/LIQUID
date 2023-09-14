import { Pipe, PipeTransform } from '@angular/core';
import { Article } from '../../models/article.model';

@Pipe({
  name: 'articlesFilterPipe'
})
export class ArticlesFilterPipe implements PipeTransform {

  transform(value: Article[], ...args: [string, number]): unknown {
    return value.filter((a: Article) => {
      return a.name.toLowerCase().includes(args[0].toLowerCase())
    });
  }
}
