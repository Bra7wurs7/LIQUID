import { Component, Input } from '@angular/core';
import { HierarchicalListArticle } from '../../models/hierarchicalListArticle.model';
import { Workspace } from '../../models/workspace.model';

@Component({
  selector: 'app-hierarchical-list',
  templateUrl: './hierarchical-list.component.html',
  styleUrls: ['./hierarchical-list.component.scss']
})
export class HierarchicalListComponent {
  activeTestDeleteLater: boolean = true;
  @Input("showBorderL") showBorderL: boolean = false;
  @Input("showBorderR") showBorderR: boolean = false;
  @Input("listItems") sourceList: HierarchicalListArticle[] = [];
  @Input("currentWorkspace") currentWorkspace?: Workspace;
  @Input("isActive") isActive: boolean = true;
  @Input("hierarchyDepth") hierarchyDepth: number = 0;
}
