import { Pipe, PipeTransform } from '@angular/core';
import { FileHierarchNode } from 'src/app/models/articleHierarchyNode';

@Pipe({
  name: 'articleHierarchyListRootFilter'
})
export class ArticleHierarchyListRootFilterPipe implements PipeTransform {

  transform(value: FileHierarchNode[]): FileHierarchNode[] {
    return value.filter((node) => node.parents.length === 0);
  }

}
