export class FileHierarchNode {
    node: [string, string];
    children: FileHierarchNode[];
    parents: FileHierarchNode[];
    constructor(node: [string, string], children = [], parents = []) {
        this.node = node;
        this.children = children;
        this.parents = parents;
    }
}