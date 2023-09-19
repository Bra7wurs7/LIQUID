import { serializable } from "../helper/serialize.helper";
import { Article } from "./article.model";

@serializable
export class Workspace {
  readonly className: string = 'Workspace';
  activeArticles: string[];
  highlightedPanelIndex: number;
  constructor(activeArticles: string[] = [], activePanelIndex: number = -1) {
    this.activeArticles = activeArticles;
    this.highlightedPanelIndex = activePanelIndex;
  }
}
