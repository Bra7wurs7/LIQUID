export interface HierarchicalListArticle {
    uniqueName: string;
    isActive: boolean;
    subArticles: HierarchicalListArticle[];
}