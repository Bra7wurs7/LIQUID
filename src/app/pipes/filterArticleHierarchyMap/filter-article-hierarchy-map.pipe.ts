import { Pipe, PipeTransform } from '@angular/core';
import { Article } from '../../models/article.model';
import { ArticleHierarchyNode } from '../../models/articleHierarchyNode.model';

@Pipe({
  name: 'filterArticleHierarchyMap'
})
export class FilterArticleHierarchyMapPipe implements PipeTransform {

  transform(value: Map<string, ArticleHierarchyNode>, ...args: [string]): Set<ArticleHierarchyNode> {
    let filteredArticles: Set<ArticleHierarchyNode> = new Set();
    for (const article of value.values()) {
      if (article.parents.size === 0 && article.node.name.toLocaleLowerCase().includes(args[0].toLocaleLowerCase())) {
        filteredArticles.add(article)
      }
    }
    return filteredArticles;
  }

}
