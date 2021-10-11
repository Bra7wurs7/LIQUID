export class Note {
  /** The name of the note as well as its unique identifier */
  uniqueName: string;
  /** may or may not belong to a category TODO: Allow multiple categories */
  categoryName?: string;
  /** object of key value pairs, while key is the attributeSlotId of the categories attributeTableTemplate to be filled, serving as a JSONifiable map */
  attributesMap?: any;
  /** The actual markdown content of a note */
  content: string;
  constructor(
    uniqueName: string = 'New Note',
    categoryName?: string,
    attributesMap?: any,
    content: string = '',
  ) {
    this.uniqueName = uniqueName;
    this.categoryName = categoryName;
    this.attributesMap = attributesMap;
    this.content = content;
  }
}
