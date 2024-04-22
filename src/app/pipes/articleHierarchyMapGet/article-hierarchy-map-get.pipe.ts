import { Pipe, PipeTransform } from '@angular/core';
import { FileHierarchNode } from 'src/app/models/articleHierarchyNode';

@Pipe({
  name: 'articleHierarchyMapGet'
})
export class ArticleHierarchyMapGetPipe implements PipeTransform {

  transform(value: Map<string, FileHierarchNode>, ...args: string[]): FileHierarchNode[] {
    let ret: FileHierarchNode[] = [];
    for (const arg of args) {
      ret.push(value.get(arg) ?? new FileHierarchNode(new Article()))
    }
    return ret;
  }

}
