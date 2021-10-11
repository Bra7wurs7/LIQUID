import { AttributeTable } from "./noteAttribute.model";

export class Category {
  /** The name of the category, as well as its unique identifier */
  uniqueName: string;
  /** The attribute table used for notes of this category, filled with content by the fillAttribute pipe */
  attributeTableTemplate: AttributeTable;
  contentTemplate: string;
  constructor(
    uniqueName: string = 'New Category',
    attributeTableTemplate: AttributeTable = new AttributeTable(),
    contentTemplate: string = '',
  ) {
    this.uniqueName = uniqueName;
    this.attributeTableTemplate = attributeTableTemplate;
    this.contentTemplate = contentTemplate;
  }
}
