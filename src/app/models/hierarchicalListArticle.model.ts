import { Article } from "./article.model";

export interface HierarchicalListArticle {
    article: Article;
    children: HierarchicalListArticle[];
    parents: HierarchicalListArticle[];
}