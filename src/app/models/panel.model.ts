import { serializable } from "../helper/serialize.helper";

export abstract class AbstractPanel {
  htmlElement?: HTMLElement;
  uniqueName: string;
  constructor(uniqueName: string = '') {
    this.uniqueName = uniqueName;
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

@serializable
export class CategoryPanel extends AbstractPanel {
  readonly className = 'CategoryPanel';
  constructor(
    categoryName: string = '',
  ) {
    super(categoryName);
  }
}
