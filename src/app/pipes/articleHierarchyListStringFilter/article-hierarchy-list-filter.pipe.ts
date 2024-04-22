import { Pipe, PipeTransform } from '@angular/core';
import { FileHierarchNode } from 'src/app/models/articleHierarchyNode';

@Pipe({
  name: 'articleHierarchyListStringFilter'
})
export class ArticleHierarchyListStringFilterPipe implements PipeTransform {

  transform(value: FileHierarchNode[], ...args: string[]): FileHierarchNode[] {
    let filter = args[0];
    const splitFilterByHash = filter.split("#").map((n) => n.trim())
    return value.filter((node) => 
    {
      const nodeName = node.node.name;
      return nodeName.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) || splitFilterByHash.some((f) => nodeName === f)
    });
  }

}
