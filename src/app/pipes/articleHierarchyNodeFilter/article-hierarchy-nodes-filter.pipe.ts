import { Pipe, PipeTransform } from '@angular/core';
import { ArticleHierarchyNode } from 'src/app/models/articleHierarchyNode';

@Pipe({
  name: 'articleHierarchyNodesFilter',
  standalone: true
})
export class ArticleHierarchyNodesFilterPipe implements PipeTransform {

  transform(value: ArticleHierarchyNode[], ...args: string[]): ArticleHierarchyNode[] {
    return value.filter((node) => !args.includes(node.node.name) );
  }
}
