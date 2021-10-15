import { serializable } from "../helper/serialize.helper";

export abstract class GenericPanel {
  htmlElement?: HTMLElement;
  uniqueName: string;
  constructor(uniqueName: string = '') {
    this.uniqueName = uniqueName;
  }
}

@serializable
export class NotePanel extends GenericPanel {
  readonly className = 'NotePanel';
  constructor(
    noteName: string = '',
  ) {
    super(noteName);
  }
}

@serializable
export class CategoryPanel extends GenericPanel {
  readonly className = 'CategoryPanel';
  constructor(
    categoryName: string = '',
  ) {
    super(categoryName);
  }
}
