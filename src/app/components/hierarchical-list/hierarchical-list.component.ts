import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Workspace } from '../../models/workspace.model';
import { ArticleHierarchyNode } from '../../models/articleHierarchyNode.model';
import { Article } from '../../models/article.model';
import { HighlightEventsEnum } from '../../enums/highlightEvents.enum';
import { Project } from '../../models/project.model';
import { ArticleActionEnum } from '../../enums/articleActionEnum';

@Component({
  selector: 'app-hierarchical-list',
  templateUrl: './hierarchical-list.component.html',
  styleUrls: ['./hierarchical-list.component.scss']
})
export class HierarchicalListComponent {
  @Input("project") project!: Project;
  @Input("showBorderL") showBorderL: boolean = false;
  @Input("showBorderR") showBorderR: boolean = false;
  @Input("ListParent") listParent!: ArticleHierarchyNode;
  @Input("listItems") hierarchyNodeSet!: ArticleHierarchyNode[];
  @Input("currentWorkspace") currentWorkspace!: Workspace;
  @Input("isActive") isActive: boolean = true;
  @Input("isHighlighted") isHighlighted: boolean = true;
  @Input("hierarchyDepth") hierarchyDepth: number = 0;
  @Input("lsArticleName") lsArticleName?: string;
  @Input("lsParentName") lsParentName?: string;
  @Input("currentArticlePath") currentArticlePath?: string;
  @Input("highlightedArticlePath") highlightedArticlePath: number = -1;
  @Input("highlightEvents") highlightEvents!: EventEmitter<HighlightEventsEnum>;

  @Input("showNewArticleButton") showNewArticleButton: boolean = false;

  @Output("articleClicked") articleClickedEmitter = new EventEmitter<Article>();
  @Output("addArticleClicked") addArticleClicked = new EventEmitter<string>();
  @Output("articleActionClicked") articleActionClicked = new EventEmitter<{action: ArticleActionEnum, node: Article}>();

  lastRightClickedArticle?: ArticleHierarchyNode;

  items = [
    {
      label: 'Open',
      icon: 'pi pi-fw pi-folder-open',
      command: () => {if(this.lastRightClickedArticle) this.articleActionClicked.emit({action: ArticleActionEnum.toggle, node: this.lastRightClickedArticle.node})}
    },
    {
      label: 'Rename',
      icon: 'pi pi-fw pi-pencil',
    },
    {
      label: 'Edit Categories',
      icon: 'pi pi-fw pi-tags',
    },
    {
      separator: true
    },
    {
      label: 'Save as File',
      icon: 'pi pi-fw pi-download',
    },
    {
      separator: true
    },
    {
      label: 'Delete',
      icon: 'pi pi-fw pi-trash',
      command: () => {
        if(this.lastRightClickedArticle) {
          this.articleActionClicked.emit({action: ArticleActionEnum.delete, node: this.lastRightClickedArticle.node})
        }
      }
    },
  ];
  constructor() {
    this.articleActionClicked.subscribe((event) => {
      console.log(event)
    })
  }

  setlastRightClickedArticle(article: ArticleHierarchyNode) {
    this.lastRightClickedArticle = article;
  }
}
