import { serializable } from "../helper/serialize.helper";
import { GenericPanel } from "./panel.model";

@serializable
export class PanelView {
  readonly className: string = 'PanelView';
  panels: GenericPanel[];
  activePanelIndex: number;
  constructor(panels: GenericPanel[] = [], activePanelIndex: number = -1) {
    this.panels = panels;
    this.activePanelIndex = activePanelIndex;
  }
}
