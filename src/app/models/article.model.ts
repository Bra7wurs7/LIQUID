import { serializable } from "../helper/serialize.helper";

@serializable
export class Article {
  readonly className: string = 'Article';
  /** The name of the article as well as its unique identifier. e.g. "mammal" or "Richard Small" */
  name: string;
  /** Very short summary of this article, explaining its most important ideas e.g. 
    * "Mammals are a group of warm-blooded vertebrates within the class Mammalia that have hair or fur,
    * internal fertilization, and nourish their young with milk produced by the female's mammary glands." 
    */
  definition: string;
  /** A list of article names that define the groups that this article has been declared to belong to e.g. ["animal", "viviparous", "nursing"] or ["blacksmith", "human", "father"] */
  groups: string[];
  /** Object (map) of meta attributes of this article */
  attributes: Record<string, any>;
  /** The actual downput or binary content of an article */
  content: string;
  constructor(
    name: string = '',
    definition: string = '',
    tags: string[] = [],
    attributes: Record<string, any> = {},
    content: string = '',
  ) {
    this.name = name;
    this.definition = definition;
    this.groups = tags;
    this.attributes = attributes;
    this.content = content;
  }
}

export class MarkdownNote {
  /** The filename of the note, as well as its unique identifier */
  fileName: string = "";
  /** The entire markdown content of the Note, including categories, tags and attributes */
  content: string = "";
  /** JSON string of file metadata*/
  metadata: string = "";
}
