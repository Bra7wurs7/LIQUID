import { serializable } from "../helper/serialize.helper";
import { Article } from "./article";

@serializable
export class Workspace {
  readonly className: string = 'Workspace';
  viewedArticles: string[];
  constructor(viewedArticles: string[] = []) {
    this.viewedArticles = viewedArticles;
  }
}
