export abstract class GenericPanel {
  htmlElement?: HTMLElement;
}

export class NotePanel extends GenericPanel {
  noteName: string;
  constructor(
    noteName: string,
  ) {
    super();
    this.noteName = noteName;
  }
}

export class CategoryPanel extends GenericPanel {
  categoryName: string;
  constructor(
    categoryName: string,
  ) {
    super();
    this.categoryName = categoryName;
  }
}
