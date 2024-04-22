import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Workspace } from '../../models/workspace';
import { FileHierarchNode } from '../../models/articleHierarchyNode';
import { Vault } from '../../models/vault.model';
import { ArticleActionEnum } from '../../enums/articleActionEnum';

@Component({
  selector: 'app-hierarchical-list',
  templateUrl: './hierarchical-list.component.html',
  styleUrls: ['./hierarchical-list.component.scss']
})
export class HierarchicalListComponent {
  @Input() project!: Vault;
  @Input() showSearch: boolean = false;
  @Input() hierarchyDirection!: "down" | "up";
  @Input() isListRoot: boolean = false;
  @Input() listParent?: FileHierarchNode;
  @Input() hierarchyNodeList!: FileHierarchNode[];
  @Input() currentWorkspace!: Workspace;
  @Input() isActive: boolean = true;
  @Input() isHighlighted: boolean = true;
  @Input() currentArticlePath?: string;
  @Input() searchValue: string = "";

  @Output() articleClickedEmitter = new EventEmitter<Article>();
  @Output() addArticleEvent = new EventEmitter<string>();
  @Output() articleActionClicked = new EventEmitter<{ action: ArticleActionEnum, node: Article }>();

  lastRightClickedArticle?: FileHierarchNode;

  

  items = [
    {
      label: 'Open',
      icon: 'iconoir iconoir-submit-document',
      command: () => { if (this.lastRightClickedArticle) this.articleActionClicked.emit({ action: ArticleActionEnum.toggle, node: this.lastRightClickedArticle.node }) }
    },
    {
      separator: true
    },
    {
      label: 'Delete',
      icon: 'iconoir iconoir-page-minus-in',
      command: () => {
        if (this.lastRightClickedArticle) {
          this.articleActionClicked.emit({ action: ArticleActionEnum.delete, node: this.lastRightClickedArticle.node })
        }
      }
    },
  ];
  constructor() {
  }

  setlastRightClickedArticle(article: FileHierarchNode) {
    this.lastRightClickedArticle = article;
  }
}
