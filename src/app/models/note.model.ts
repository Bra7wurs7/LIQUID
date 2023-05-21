import { serializable } from "../helper/serialize.helper";

@serializable
export class Note {
  readonly className: string = 'Note';
  /** The name of the note as well as its unique identifier */
  uniqueName: string;
  /** may or may not belong to a category */
  categoryName?: string;
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
