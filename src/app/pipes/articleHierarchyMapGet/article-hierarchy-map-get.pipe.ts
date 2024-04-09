import { Pipe, PipeTransform } from '@angular/core';
import { Article } from 'src/app/models/article.model';
import { FileHierarchNode } from 'src/app/models/articleHierarchyNode.model';

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
