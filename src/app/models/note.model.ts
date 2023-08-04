import { serializable } from "../helper/serialize.helper";

@serializable
export class Note {
  readonly className: string = 'Note';
  /** The name of the note as well as its unique identifier */
  uniqueName: string;
  /** may or may not belong to a category @deprecated*/
  categoryName?: string;
  /** may belong to any amount of categories */
  categories?: string[];
  /** object of key value:string pairs, while key is the attributeSlotId of the categories attributeTableTemplate to be filled, serving as a JSONifiable map */
  attributesMap: Record<string, any>;
  /** The actual markdown content of a note */
  content: string;
  /** all elements that should show up in the left sidebar */
  relatedElements: string[] = [];
  constructor(
    uniqueName: string = '',
    categoryName?: string,
    attributesMap: Record<string, any> = {},
    content: string = '',
  ) {
    this.uniqueName = uniqueName;
    this.categoryName = categoryName;
    this.attributesMap = attributesMap;
    this.content = content;
  }
}

export class MarkdownNote {
  /** The filename of the note, as well as its unique identifier */
  uniqueName: string = "";
  /** The entire markdown content of the Note, including categories, tags and attributes */
  content: string = "";
}
