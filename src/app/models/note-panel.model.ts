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


