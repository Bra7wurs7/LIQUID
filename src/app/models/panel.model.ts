export abstract class GenericPanel {
  htmlElement?: HTMLElement;
  uniqueName: string;
  constructor(uniqueName: string) {
    this.uniqueName = uniqueName;
  }
}

export class NotePanel extends GenericPanel {
  constructor(
    noteName: string,
  ) {
    super(noteName);
  }
}

export class CategoryPanel extends GenericPanel {

  constructor(
    categoryName: string,
  ) {
    super(categoryName);
  }
}
