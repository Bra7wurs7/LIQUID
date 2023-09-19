import { serializable } from "../helper/serialize.helper";

/** @TODO Rework how open panels are represented and saved*/
export abstract class AbstractPanel {
  htmlElement?: HTMLElement;
  articleName: string;
  constructor(uniqueName: string = '') {
    this.articleName = uniqueName;
  }
}

@serializable
export class NotePanel extends AbstractPanel {
  readonly className = 'NotePanel';
  constructor(
    noteName: string = '',
  ) {
    super(noteName);
  }
}
