import { Pipe, PipeTransform } from '@angular/core';
import { Article } from 'src/app/models/article';
import { ArticleHierarchyNode } from 'src/app/models/articleHierarchyNode';

@Pipe({
  name: 'articleHierarchyMapGet'
})
export class ArticleHierarchyMapGetPipe implements PipeTransform {

  transform(value: Map<string, ArticleHierarchyNode>, ...args: string[]): ArticleHierarchyNode[] {
    let ret: ArticleHierarchyNode[] = [];
    for (const arg of args) {
      ret.push(value.get(arg) ?? new ArticleHierarchyNode(new Article()))
    }
    return ret;
  }

}
