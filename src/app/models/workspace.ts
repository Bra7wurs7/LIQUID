import { serializable } from "../helper/serialize.helper";
import { Article } from "./article";

@serializable
export class Workspace {
  readonly className: string = 'Workspace';
  viewedArticles: string[];
  activeArticleIndex: number;
  constructor(viewedArticles: string[] = [], activeArticleIndex: number = -1) {
    this.viewedArticles = viewedArticles;
    this.activeArticleIndex = activeArticleIndex;
  }
}
