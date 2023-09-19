import { Article } from "./article.model";

export class ArticleHierarchyNode {
    node: Article;
    children: Set<ArticleHierarchyNode>;
    parents: Set<ArticleHierarchyNode>;
    constructor(node: Article, children = new Set<ArticleHierarchyNode>(), parents = new Set<ArticleHierarchyNode>()) {
        this.node = node;
        this.children = children;
        this.parents = parents;
    }
}
