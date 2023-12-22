import { Pipe, PipeTransform } from '@angular/core';
import { ArticleHierarchyNode } from 'src/app/models/articleHierarchyNode.model';

@Pipe({
  name: 'articleHierarchyListStringFilter'
})
export class ArticleHierarchyListStringFilterPipe implements PipeTransform {

  transform(value: ArticleHierarchyNode[], ...args: string[]): ArticleHierarchyNode[] {
    let filter = args[0];
    return value.filter((node) => node.node.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));
  }

}
