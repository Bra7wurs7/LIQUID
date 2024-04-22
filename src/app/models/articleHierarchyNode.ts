import { Article } from "./article";

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