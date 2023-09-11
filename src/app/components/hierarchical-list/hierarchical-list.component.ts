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
  @Input("borderLeft") borderLeft: boolean = true;
  @Input("borderRight") borderRight: boolean = false;
  @Input("listItems") listItems: HierarchicalListArticle[] = [];
  @Input("sourceListItem") sourceItem?: HierarchicalListArticle;
  @Input("currentWorkspace") currentWorkspace?: Workspace;
}
