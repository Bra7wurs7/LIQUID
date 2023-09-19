import { serializable } from "../helper/serialize.helper";
import { AbstractPanel } from "./panel.model";

@serializable
export class Workspace {
  readonly className: string = 'Workspace';
  activeArticlePanels: AbstractPanel[];
  highlightedPanelIndex: number;
  constructor(panels: AbstractPanel[] = [], activePanelIndex: number = -1) {
    this.activeArticlePanels = panels;
    this.highlightedPanelIndex = activePanelIndex;
  }
}
