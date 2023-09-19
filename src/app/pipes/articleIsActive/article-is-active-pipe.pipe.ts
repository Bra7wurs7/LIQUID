import { Pipe, PipeTransform } from '@angular/core';
import { Article } from '../../models/article.model';
import { Workspace } from '../../models/workspace.model';

@Pipe({
  name: 'articleIsActive'
})
export class ArticleIsActivePipe implements PipeTransform {

  transform(value: Article, ...args: [Workspace]): boolean {
    return args[0].activeArticlePanels.some((panel) => panel.articleName === value.name);
  }

}
