import { Pipe, PipeTransform } from '@angular/core';
import { FileHierarchNode } from 'src/app/models/articleHierarchyNode';


@Pipe({
  name: 'articleHierarchyNodesFilter',
  standalone: true
})
export class ArticleHierarchyNodesFilterPipe implements PipeTransform {

  transform(value: FileHierarchNode[], ...args: string[]): FileHierarchNode[] {
    return value.filter((node) => !args.includes(node.node.name) );
  }
}
