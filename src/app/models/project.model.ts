import { Article } from "./article.model";
import { Workspace } from "./workspace.model";
import { reviver, serializable } from "../helper/serialize.helper";

export class Project {
  title: string;
  /** Object representing a map of all notes for this project */
  articles: Map<string, Article>;
  /** */
  workspaces: Workspace[] = [];
  /** */
  activeWorkspaceIndex: number;
  /** version of GAS that this Project last saved with */
  version: string;
  constructor(
    title: string,
    articles: Map<string, Article> = new Map(),
    workspaces: Workspace[] = [new Workspace()],
    activeWorkspaceIndex: number = 0,
    version: string = "0.0.1",
  ) {
    this.title = title
    this.articles = articles;
    this.workspaces = workspaces;
    this.activeWorkspaceIndex = activeWorkspaceIndex;
    this.version = version
  }

  toSerializableProject(): SerializableProject {
    const notes: any = {};
    const categories: any = {};
    this.articles.forEach((value, key) => {
      notes[key] = value;
    })
    return new SerializableProject(this.title, notes, categories, this.workspaces, this.activeWorkspaceIndex, this.version);
  }
}

@serializable
export class SerializableProject {
  readonly className: string = 'SerializableProject';
  title: string;
  /** Object representing a map of all notes for this project */
  notes: any;
  /** Object representing a map of all note categories for this project*/
  categories: any;
  /** */
  workspaces: Workspace[] = [];
  /** */
  activeWorkspaceIndex: number;
  /** version of GAS that this Project last saved with */
  version: string;

  constructor(
    title: string = '',
    notes: any = {},
    categories: any = {},
    workspaces: Workspace[] = [],
    activeWorkspaceIndex: number = 0,
    version: string = "0.0.1",
  ) {
    this.title = title
    this.notes = notes;
    this.categories = categories;
    this.workspaces = workspaces;
    this.activeWorkspaceIndex = activeWorkspaceIndex;
    this.version = version
  }

  toProject(): Project {
    const notes: Map<string, Article> = new Map();
    Object.keys(this.notes).forEach((key: string) => {
      notes.set(key, this.notes[key] as Article)
    });
    return new Project(this.title, notes, this.workspaces, this.activeWorkspaceIndex, this.version);
  }

  serialize(): string {
    return JSON.stringify(this, null, 2);
  }

  static deserialize(json: string): SerializableProject {
    return JSON.parse(json, reviver);
  }
}

export const defaultProject = new Project("New Project")



