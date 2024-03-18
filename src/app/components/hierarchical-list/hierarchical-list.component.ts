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
  @Input() project!: Project;
  @Input() showSearch: boolean = false;
  @Input() hierarchyDirection!: "down" | "up";
  @Input() isListRoot: boolean = false;
  @Input() listParent!: ArticleHierarchyNode;
  @Input() hierarchyNodeList!: ArticleHierarchyNode[];
  @Input() currentWorkspace!: Workspace;
  @Input() isActive: boolean = true;
  @Input() isHighlighted: boolean = true;
  @Input() currentArticlePath?: string;

  @Output() articleClickedEmitter = new EventEmitter<Article>();
  @Output() addArticleEvent = new EventEmitter<string>();
  @Output() articleActionClicked = new EventEmitter<{ action: ArticleActionEnum, node: Article }>();

  lastRightClickedArticle?: ArticleHierarchyNode;

  searchValue: string = "";

  items = [
    {
      label: 'Open',
      icon: 'pi pi-fw pi-folder-open',
      command: () => { if (this.lastRightClickedArticle) this.articleActionClicked.emit({ action: ArticleActionEnum.toggle, node: this.lastRightClickedArticle.node }) }
    },
    /*
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
    */
    {
      separator: true
    },
    {
      label: 'Delete',
      icon: 'pi pi-fw pi-trash',
      command: () => {
        if (this.lastRightClickedArticle) {
          this.articleActionClicked.emit({ action: ArticleActionEnum.delete, node: this.lastRightClickedArticle.node })
        }
      }
    },
  ];
  constructor() {
  }

  setlastRightClickedArticle(article: ArticleHierarchyNode) {
    this.lastRightClickedArticle = article;
  }
}
