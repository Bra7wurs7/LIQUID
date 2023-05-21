import { serializable } from "../helper/serialize.helper";
import { AbstractPanel } from "./panel.model";

@serializable
export class PanelView {
  readonly className: string = 'PanelView';
  panels: AbstractPanel[];
  activePanelIndex: number;
  constructor(panels: AbstractPanel[] = [], activePanelIndex: number = -1) {
    this.panels = panels;
    this.activePanelIndex = activePanelIndex;
  }
}
