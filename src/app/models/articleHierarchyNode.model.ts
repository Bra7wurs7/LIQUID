import { Article } from "./article.model";

export class ArticleHierarchyNode {
    node: Article;
    children: ArticleHierarchyNode[];
    parents: ArticleHierarchyNode[];
    constructor(node: Article, children = [], parents = []) {
        this.node = node;
        this.children = children;
        this.parents = parents;
    }
}