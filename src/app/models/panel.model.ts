import { serializable } from "../helper/serialize.helper";

export abstract class AbstractPanel {
  htmlElement?: HTMLElement;
  name: string;
  constructor(uniqueName: string = '') {
    this.name = uniqueName;
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
