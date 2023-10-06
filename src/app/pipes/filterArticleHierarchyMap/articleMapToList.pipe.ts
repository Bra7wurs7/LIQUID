import { Pipe, PipeTransform } from '@angular/core';
import { Article } from '../../models/article.model';
import { ArticleHierarchyNode } from '../../models/articleHierarchyNode.model';

@Pipe({
  name: 'articleMapToList'
})
export class ArticleMapToList implements PipeTransform {

  transform(value: Map<string, ArticleHierarchyNode>, ...args: [string]): ArticleHierarchyNode[] {
    let filteredArticles: ArticleHierarchyNode[] = [];
    for (const article of value.values()) {
      if ((article.parents.length === 0 && !args[0]) || (args[0] && article.node.name.toLocaleLowerCase().includes(args[0].toLocaleLowerCase()))) {
        filteredArticles.push(article);
      }
    }
    return filteredArticles;
  }
}
