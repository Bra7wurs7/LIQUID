import { Pipe, PipeTransform } from '@angular/core';
import { ArticleHierarchyNode } from 'src/app/models/articleHierarchyNode.model';

@Pipe({
  name: 'articleHierarchyListRootFilter'
})
export class ArticleHierarchyListRootFilterPipe implements PipeTransform {

  transform(value: ArticleHierarchyNode[]): ArticleHierarchyNode[] {
    return value.filter((node) => node.parents.length === 0);
  }

}
