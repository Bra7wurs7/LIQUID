import { serializable } from "../helper/serialize.helper";

@serializable
export class Article {
  readonly className: string = 'Article';
  /** The name of the article as well as its unique identifier. e.g. "mammal" or "Richard Small" */
  name: string;
  /** A list of article names that define the groups that this article has been declared to belong to e.g. ["animal", "viviparous", "nursing"] or ["blacksmith", "human", "father"] */
  groups: string[];
  /** Object (map) of meta attributes of this article */
  attributes: Record<string, any>;
  /** The actual downput or binary content of an article */
  content: string;
  constructor(
    name: string = '',
    groups: string[] = [],
    content: string = '',
  ) {
    this.name = name;
    this.groups = groups;
    this.attributes = {};
    this.content = content;
  }
}

export class MarkdownNote {
  /** The filename of the note, as well as its unique identifier */
  fileName: string = "";
  /** The entire markdown content of the Note, including categories, groups and attributes */
  content: string = "";
  /** JSON string of file metadata*/
  metadata: string = "";
}
