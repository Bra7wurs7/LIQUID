import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Workspace } from '../../models/workspace.model';
import { ArticleHierarchyNode } from '../../models/articleHierarchyNode.model';
import { Article } from '../../models/article.model';
import { HighlightEventsEnum } from '../../enums/highlightEvents.enum';

@Component({
  selector: 'app-hierarchical-list',
  templateUrl: './hierarchical-list.component.html',
  styleUrls: ['./hierarchical-list.component.scss']
})
export class HierarchicalListComponent {
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

  constructor() {

  }
}
