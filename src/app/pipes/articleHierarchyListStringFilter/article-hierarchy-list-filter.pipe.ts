import { Pipe, PipeTransform } from '@angular/core';
import { ArticleHierarchyNode } from 'src/app/models/articleHierarchyNode.model';

@Pipe({
  name: 'articleHierarchyListStringFilter'
})
export class ArticleHierarchyListStringFilterPipe implements PipeTransform {

  transform(value: ArticleHierarchyNode[], ...args: string[]): ArticleHierarchyNode[] {
    let filter = args[0];
    const splitFilterByHash = filter.split("#").map((n) => n.trim())
    return value.filter((node) => 
    {
      const nodeName = node.node.name;
      return nodeName.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) || splitFilterByHash.some((f) => nodeName === f)
    });
  }

}
