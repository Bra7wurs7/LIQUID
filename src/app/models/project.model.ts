import { AbstractPanel } from "./panel.model";
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
  activeViewIndex: number;
  /** version of GAS that this Project last saved with */
  version: number;
  constructor(
    title: string,
    notes: Map<string, Article>,
    workspaces: Workspace[],
    activeViewIndex: number = 0,
    version: number = 1,
  ) {
    this.title = title
    this.articles = notes;
    this.workspaces = workspaces;
    this.activeViewIndex = activeViewIndex;
    this.version = version
  }

  toSerializableProject(): SerializableProject {
    const notes: any = {};
    const categories: any = {};
    const workspaces: Workspace[] = []
    this.articles.forEach((value, key) => {
      notes[key] = value;
    })
    this.workspaces.forEach((workspace) => {
      const viewCopy = Object.assign({}, workspace);
      const panels: AbstractPanel[] = [];
      viewCopy.activeArticlePanels.forEach((panel) => {
        const panelCopy = Object.assign({}, panel);
        delete panelCopy.htmlElement;
        panels.push(panelCopy);
      })
      viewCopy.activeArticlePanels = panels;
      workspaces.push(viewCopy);
    })
    return new SerializableProject(this.title, notes, categories, workspaces, this.activeViewIndex, this.version);
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
  activeViewIndex: number;
  /** version of GAS that this Project last saved with */
  version: number;

  constructor(
    title: string = '',
    notes: any = {},
    categories: any = {},
    workspaces: Workspace[] = [],
    activeViewIndex: number = 0,
    version: number = 1,
  ) {
    this.title = title
    this.notes = notes;
    this.categories = categories;
    this.workspaces = workspaces;
    this.activeViewIndex = activeViewIndex;
    this.version = version
  }

  toProject(): Project {
    const notes: Map<string, Article> = new Map();
    Object.keys(this.notes).forEach((key: string) => {
      notes.set(key, this.notes[key] as Article)
    });
    return new Project(this.title, notes, this.workspaces, this.activeViewIndex, this.version);
  }

  serialize(): string {
    return JSON.stringify(this, null, 2);
  }

  static deserialize(json: string): SerializableProject {
    return JSON.parse(json, reviver);
  }
}

export const defaultProjectJson = {
  "className": "SerializableProject",
  "workspaces": [
    {
      "className": "PanelView",
      "panels": [
        {
          "uniqueName": "Getting Started",
          "className": "NotePanel"
        },
        {
          "uniqueName": "User Interface",
          "className": "NotePanel"
        }
      ],
      "activePanelIndex": 1
    },
    {
      "className": "PanelView",
      "panels": [],
      "activePanelIndex": 0
    }
  ],
  "title": "Tutorial Project",
  "notes": {
    "Getting Started": {
      "className": "Note",
      "relatedElements": [
        "User Interface"
      ],
      "uniqueName": "Getting Started",
      "attributesMap": {},
      "content": "## Hello!\n### Thanks for evaluating this (very early) prototype of Game Master's Assistant Software (GAS)!\nThis prototype was developed as part of a bachelors thesis trying to design a software to assist game masters with preparing and running tabletop role-playing games, that is both more user friendly, and more attuned to the needs of game-masters than similar software. After you are done with evaluating GAS I would like to ask you to fill out a short survey on the usability of the application (2-10 minutes). You can access the survey at any time by clicking the button labeled 'survey' in the bottom left corner of the page.\n#### Design Philosophy\nAt it's foundation, GAS will be a powerful, **networked note-keeping** tool and knowledge-base for world-building and writing of non-linear stories. It will provide\n- a **categorization** and templating system for notes, allowing users to define types and categories of notes, and allowing notes of the same category to share content and layout\n- the ability to group notes, and to **filter information** of viewed notes to provide the user with all and only information they need at a given moment, like during a **combat encounter** \n- a **chronicle** feature to allow it's users to define **calendars** and **timelines** of events for the fictional worlds and stories they are writing\n- an **atlas** to define and layer clickable, navigable **maps**\n- random **content generators** that the user can set up and customize themselves\n- **external resources** like **websites** of **PDFs** that can be opened inside of of GAS, referenced from or even embedded into Notes.\n\nAll while allowing information to be stored and networked in a way that imitates how our brains structure information.\n\nIn GAS, every Item of content has a unique name. That way you can create links to any item of content by writing it's name in square brackets anywhere you can put text like this: [[Getting Started]]. Text in GAS can be formatted using Markdown. For a quick introduction on how to use markdown click [here](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).\n\nThe prototype of GAS you're looking at right now is **nowhere near feature-complete**, that means that many 'big' features like the chronicle, atlas, generator and resource tools are not yet implemented. Many smaller equally important features like the ability to drag and drop anything anywhere, or embed project content items into the project's other content items also don't work yet. However, the most important features of GAS, namely **creating**, **formatting**, **categorizing** and **cross-referencing** notes already do *(mostly)* work.\n\nTo get started with using the application you may want to read the Note [[User Interface]]. It should already be opened and can be found right below this Note. Otherwise feel free to create a new project using the menu point \'Project\' at the bottom of the left sidebar."
    },
    "User Interface": {
      "className": "Note",
      "relatedElements": [
        "Getting Started",
        "Notes Tutorial",
        "Categories Tutorial",
        "Encounter Mode",
        "Views Tutorial"
      ],
      "uniqueName": "User Interface",
      "attributesMap": {},
      "content": "This Note explains the basics of GAS' user interface. Let's start with the\n#### Left Sidebar\nwhich, unsurprisingly is the navigation bar you find at the left side of this page. The left sidebar is used for managing and accessing **any** kind of your project's content. By clicking the chevron on the panel labelled 'Notes' for example, you can expand said panel revealing a list of all notes of the current Project. Clicking the plus icon of the same panel lets you add a new note. The same already works for the 'Categories' panel.\nExpanding the panel labeled 'Project' lets you create, save and load projects. 'Download' lets you download the entire project along with all it's notes, categories, etc. into your local drive.  'Save' also stores your project locally, but it does so inside of your browser.\n\n#### Center\nAll notes, categories, and other types of your project's content you open will appear as cards in the center of your screen. You are looking at such a card right now!\nContent cards can be closed, collapsed or expanded and reordered using the buttons on the left side of their header-toolbar. The content item they display may also be edited after clicking the edit button with the pencil icon, read [[Notes Tutorial]] and [[Categories Tutorial]] for more information on that.\n**The Card that you last hovered your mouse cursor over is considered the 'Active' card** that is important to remember, because the content of the right sidebar depends on what card is considered active. The title of the active card is highlighted. You can see the card title color and right sidebar content changing when you hover back and forth between two cards.\n\nAlso easily missed are the buttons in the bottom corners of the center-area of the page. They are transparent until you hover over them. The two buttons in the right corner allow you to quickly scroll to the top or bottom of the center-area. The button with the abstract icon displaying people will enable Encounter Mode once that feature has been implemented. The buttons right next to that allow you to change views. For more information on Views read [[Views Tutorial]].\n\nFinally, the\n#### Right Sidebar\ndisplays references between the item displayed in the active card, and other content items of the project. In a future version of GAS it will display all links from the currently active content item to other items, as well as all links back from all other items to the active one. Currently it only displays links that were manually created by typing a item name into the search/link bar and clicking the 'New Link: ___' button that appears."
    },
    "Notes Tutorial": {
      "className": "Note",
      "relatedElements": [
        "User Interface",
        "Categories Tutorial"
      ],
      "uniqueName": "Notes Tutorial",
      "attributesMap": {},
      "content": "To edit the content of note, click the button displaying a pencil in the header toolbar of a opened note's card. This will toggle 'Edit Mode' for this note's card.\n\n\nWhen editing a note you can not only change it's **content text**, but also it's **category** using the input field next to the note's name.\nWhen the category a note belongs to has defined an attributes table, you can also edit the changeable **table cells**.\nTo read up on how categories and attribute tables work open this: [[Categories Tutorial]]"
    },
    "Categories Tutorial": {
      "className": "Note",
      "relatedElements": [],
      "uniqueName": "Categories Tutorial",
      "categoryName": "Example Category",
      "attributesMap": {
        "06aae9c3-d573-4d8d-8b5d-0a0dcd4834be": "Cool Dude",
        "72de2edf-cbf4-4790-b15d-70632a40f14b": "Big Variable Text",
        "46c4c4c2-854e-4dcb-91f2-f864bf32f6ae": "Small Variable Text",
        "cb314556-134a-41a3-a8aa-cec065dadf1b": "",
        "539e9e34-7b71-43ea-8a01-2e4e949847a4": "Another Variable, but this time longer"
      },
      "content": "I would love to explain how a category's attribute table designer works, but Its rather complicated and I don't have much time left to write this tutorial. I'm hoping that the UI documents itself well enough. To look at another example how the attribute table designer can work click here: [[Some NPC]] and [[5e Monster]]"
    },
    "Some NPC": {
      "className": "Note",
      "relatedElements": [],
      "uniqueName": "Some NPC",
      "categoryName": "5e Monster",
      "attributesMap": {
        "a4430fcf-14da-4896-b08a-2c3971efaba4": "John Smith",
        "001": "medium human, chaotic good",
        "002": "10",
        "003": "14 (2d12+1)",
        "004": "30ft.",
        "005": "10",
        "006": "10",
        "007": "10",
        "008": "10",
        "009": "10",
        "010": "10",
        "011": "passive perception 10",
        "012": "common",
        "013": "1 (200 XP)"
      },
      "content": "# Hausit exire\n\n## Volucris audet intraverat nemus temporis de vertere\n\nLorem markdownum oculi; horrescere potest perdere Epaphi Inachus duxit nec\ncorpora. Tamen pauper, [est tum remissis](http://www.ignisiam.net/) nomine\ngradus erat colla in ante, horret.\n\n- Currus inquit removere\n- Migrare mundi hac praestare Claros adspicias\n- Datura te huc qui cornua mirabile iaculum\n- Divulsaque Cythereius proceres redditque longius ventos\n- Fuit letalibus novas petebant tu\n- Et nupta\n\n## Corinthus quae motus additur albo\n\nNeve suas quam tenebant, angue ipse gemini mutatas plusque, causam enim tenui!\nMox tetigit ludit in ira micantes forte respicere iacentes utraque dederat.\nPatris ipsa artem, crus erat petunt, deiectoque summas vaga; cortex cui? *Volat\npia*: vincula spectari dumque, **et iudice** minae!\n\nEreboque et posse crines Latiis genetrix lacerum.\nfuso domino, vana suoque, precibus. Tendat se vocant placet tantum, fuit rector\ndolisque: hinc Tres examina; et cum. Crura usurus arma. Rivo aquis veneror, manu\nego nec ut retroque adversa agmen iovis.\n\n> An nomine in hac sorte veteremque ubi et umeris Iovis tenet. Timido sine, meo\n> et fervidus et filum perpetiar et ille blanditiasque quos quaeque vertuntur,\n> ire utque est. Unda dumque sed servantes aggere quod videndo, quam finite\n> plantis caelum; dicta suam vicit attulit, terris!\n\n## Nec tegit modo ruris resonabat per sit\n\nCultus Mycenae illa mediis, prima inmittam securiferumque terra et dedit; et\nfluit in. Implevit ossibus pabula eripere, delapsus proelia, frigidus iam nec\ntempora novitate protinus.\n\n> Adflati sub adnuit genus matura, meus veluti plura numero si vos in igne ope;\n> chaos saevi. Dixit poposcerat modo herbas tamen maxima salutifera fumo sed\n> ventrem. Hector me artus, Iuppiter supplicium recidendum aries variare.\n\nHos frutex miratur cognoram Ericthonio pressum pensa cervix si tandem. Vulgasse\nelectae quercum fama non corpora melioris sperni est stellas. Mando eris pavet.\nSed mei regis. Nova per natus venit columque tamen, sensit arvis Ceres foret.\n\nTerrita sermone; magni tamen adporrectumque erubuit corpora non naribus coniuge\nnasci. Levis rictus est sit [cuncta](http://www.suabrevi.net/ferens); saxo essem\n[Tartareas veniat](http://www.ubi-nihil.org/rhexenoreproperus) votaque illius.\n**Illi undas**: aere consilii. Est vicina vult munus pignus."
    },
    "Views Tutorial": {
      "className": "Note",
      "relatedElements": [],
      "uniqueName": "Views Tutorial",
      "attributesMap": {},
      "content": "You can find a list of circles with numbers in them at the bottom of the center-area of the application, right next to the 'Encounter Mode' button. Those circles represent 'views'. The numbers inside of the circles show how many cards are open in that specific view. You can change views by clicking on their respective buttons.\nViews work like tabs or like virtual desktops. When your list of opened cards gets too long you can simply switch to a different, empty view to clear your screen.\nI'd recommend simply trying it out."
    }
  },
  "categories": {
    "5e Monster": {
      "className": "Category",
      "uniqueName": "defaultCategory",
      "attributeTableTemplate": {
        "className": "AttributeTable",
        "float": "right",
        "children": [
          {
            "width": "max",
            "bordered": false,
            "visibility": "both",
            "content": "",
            "contentSlotId": "",
            "isContainer": true,
            "className": "AttributeContainer",
            "direction": "col",
            "children": [
              {
                "width": "full",
                "bordered": false,
                "visibility": "both",
                "content": "Monster",
                "contentSlotId": "a4430fcf-14da-4896-b08a-2c3971efaba4",
                "isContainer": false,
                "className": "AttributeItem",
                "separator": "none",
                "fontSize": "large",
                "italic": false,
                "bold": true,
                "constant": false
              },
              {
                "width": "full",
                "bordered": false,
                "visibility": "both",
                "content": "",
                "contentSlotId": "001",
                "isContainer": false,
                "className": "AttributeItem",
                "separator": "none",
                "fontSize": "medium",
                "italic": true,
                "bold": false,
                "constant": false
              },
              {
                "width": "unset",
                "bordered": false,
                "visibility": "both",
                "content": "",
                "contentSlotId": "",
                "isContainer": false,
                "className": "AttributeItem",
                "separator": "medium",
                "fontSize": "medium",
                "italic": false,
                "bold": false,
                "constant": false
              },
              {
                "width": "full",
                "bordered": false,
                "visibility": "both",
                "content": "",
                "contentSlotId": "",
                "isContainer": true,
                "className": "AttributeContainer",
                "direction": "row",
                "children": [
                  {
                    "width": "unset",
                    "bordered": false,
                    "visibility": "both",
                    "content": "Armor Class",
                    "contentSlotId": "",
                    "isContainer": false,
                    "className": "AttributeItem",
                    "separator": "none",
                    "fontSize": "medium",
                    "italic": false,
                    "bold": true,
                    "constant": true
                  },
                  {
                    "width": "unset",
                    "bordered": false,
                    "visibility": "both",
                    "content": "",
                    "contentSlotId": "002",
                    "isContainer": false,
                    "className": "AttributeItem",
                    "separator": "none",
                    "fontSize": "medium",
                    "italic": false,
                    "bold": false,
                    "constant": false
                  }
                ],
                "justify": "start",
                "align": "stretch"
              },
              {
                "width": "full",
                "bordered": false,
                "visibility": "both",
                "content": "",
                "contentSlotId": "",
                "isContainer": true,
                "className": "AttributeContainer",
                "direction": "row",
                "children": [
                  {
                    "width": "unset",
                    "bordered": false,
                    "visibility": "both",
                    "content": "Hit Points",
                    "contentSlotId": "",
                    "isContainer": false,
                    "className": "AttributeItem",
                    "separator": "none",
                    "fontSize": "medium",
                    "italic": false,
                    "bold": true,
                    "constant": true
                  },
                  {
                    "width": "unset",
                    "bordered": false,
                    "visibility": "both",
                    "content": "",
                    "contentSlotId": "003",
                    "isContainer": false,
                    "className": "AttributeItem",
                    "separator": "none",
                    "fontSize": "medium",
                    "italic": false,
                    "bold": false,
                    "constant": false
                  }
                ],
                "justify": "start",
                "align": "stretch"
              },
              {
                "width": "full",
                "bordered": false,
                "visibility": "both",
                "content": "",
                "contentSlotId": "",
                "isContainer": true,
                "className": "AttributeContainer",
                "direction": "row",
                "children": [
                  {
                    "width": "unset",
                    "bordered": false,
                    "visibility": "both",
                    "content": "Speed",
                    "contentSlotId": "",
                    "isContainer": false,
                    "className": "AttributeItem",
                    "separator": "none",
                    "fontSize": "medium",
                    "italic": false,
                    "bold": true,
                    "constant": true
                  },
                  {
                    "width": "unset",
                    "bordered": false,
                    "visibility": "both",
                    "content": "",
                    "contentSlotId": "004",
                    "isContainer": false,
                    "className": "AttributeItem",
                    "separator": "none",
                    "fontSize": "medium",
                    "italic": false,
                    "bold": false,
                    "constant": false
                  }
                ],
                "justify": "start",
                "align": "stretch"
              },
              {
                "width": "unset",
                "bordered": false,
                "visibility": "both",
                "content": "",
                "contentSlotId": "",
                "isContainer": false,
                "className": "AttributeItem",
                "separator": "medium",
                "fontSize": "medium",
                "italic": false,
                "bold": false,
                "constant": false
              },
              {
                "width": "full",
                "bordered": false,
                "visibility": "both",
                "content": "",
                "contentSlotId": "",
                "isContainer": true,
                "className": "AttributeContainer",
                "direction": "row",
                "children": [
                  {
                    "width": "full",
                    "bordered": false,
                    "visibility": "both",
                    "content": "",
                    "contentSlotId": "",
                    "isContainer": true,
                    "className": "AttributeContainer",
                    "direction": "col",
                    "children": [
                      {
                        "width": "unset",
                        "bordered": false,
                        "visibility": "both",
                        "content": "STR",
                        "contentSlotId": "",
                        "isContainer": false,
                        "className": "AttributeItem",
                        "separator": "none",
                        "fontSize": "medium",
                        "italic": false,
                        "bold": true,
                        "constant": true
                      },
                      {
                        "width": "unset",
                        "bordered": false,
                        "visibility": "both",
                        "content": "",
                        "contentSlotId": "005",
                        "isContainer": false,
                        "className": "AttributeItem",
                        "separator": "none",
                        "fontSize": "medium",
                        "italic": false,
                        "bold": false,
                        "constant": false
                      }
                    ],
                    "justify": "start",
                    "align": "center"
                  },
                  {
                    "width": "full",
                    "bordered": false,
                    "visibility": "both",
                    "content": "",
                    "contentSlotId": "",
                    "isContainer": true,
                    "className": "AttributeContainer",
                    "direction": "col",
                    "children": [
                      {
                        "width": "unset",
                        "bordered": false,
                        "visibility": "both",
                        "content": "DEX",
                        "contentSlotId": "",
                        "isContainer": false,
                        "className": "AttributeItem",
                        "separator": "none",
                        "fontSize": "medium",
                        "italic": false,
                        "bold": true,
                        "constant": true
                      },
                      {
                        "width": "unset",
                        "bordered": false,
                        "visibility": "both",
                        "content": "",
                        "contentSlotId": "006",
                        "isContainer": false,
                        "className": "AttributeItem",
                        "separator": "none",
                        "fontSize": "medium",
                        "italic": false,
                        "bold": false,
                        "constant": false
                      }
                    ],
                    "justify": "start",
                    "align": "center"
                  },
                  {
                    "width": "full",
                    "bordered": false,
                    "visibility": "both",
                    "content": "",
                    "contentSlotId": "",
                    "isContainer": true,
                    "className": "AttributeContainer",
                    "direction": "col",
                    "children": [
                      {
                        "width": "unset",
                        "bordered": false,
                        "visibility": "both",
                        "content": "CON",
                        "contentSlotId": "",
                        "isContainer": false,
                        "className": "AttributeItem",
                        "separator": "none",
                        "fontSize": "medium",
                        "italic": false,
                        "bold": true,
                        "constant": true
                      },
                      {
                        "width": "unset",
                        "bordered": false,
                        "visibility": "both",
                        "content": "",
                        "contentSlotId": "007",
                        "isContainer": false,
                        "className": "AttributeItem",
                        "separator": "none",
                        "fontSize": "medium",
                        "italic": false,
                        "bold": false,
                        "constant": false
                      }
                    ],
                    "justify": "start",
                    "align": "center"
                  },
                  {
                    "width": "full",
                    "bordered": false,
                    "visibility": "both",
                    "content": "",
                    "contentSlotId": "",
                    "isContainer": true,
                    "className": "AttributeContainer",
                    "direction": "col",
                    "children": [
                      {
                        "width": "unset",
                        "bordered": false,
                        "visibility": "both",
                        "content": "INT",
                        "contentSlotId": "",
                        "isContainer": false,
                        "className": "AttributeItem",
                        "separator": "none",
                        "fontSize": "medium",
                        "italic": false,
                        "bold": true,
                        "constant": true
                      },
                      {
                        "width": "unset",
                        "bordered": false,
                        "visibility": "both",
                        "content": "",
                        "contentSlotId": "008",
                        "isContainer": false,
                        "className": "AttributeItem",
                        "separator": "none",
                        "fontSize": "medium",
                        "italic": false,
                        "bold": false,
                        "constant": false
                      }
                    ],
                    "justify": "start",
                    "align": "center"
                  },
                  {
                    "width": "full",
                    "bordered": false,
                    "visibility": "both",
                    "content": "",
                    "contentSlotId": "",
                    "isContainer": true,
                    "className": "AttributeContainer",
                    "direction": "col",
                    "children": [
                      {
                        "width": "unset",
                        "bordered": false,
                        "visibility": "both",
                        "content": "WIS",
                        "contentSlotId": "",
                        "isContainer": false,
                        "className": "AttributeItem",
                        "separator": "none",
                        "fontSize": "medium",
                        "italic": false,
                        "bold": true,
                        "constant": true
                      },
                      {
                        "width": "unset",
                        "bordered": false,
                        "visibility": "both",
                        "content": "",
                        "contentSlotId": "009",
                        "isContainer": false,
                        "className": "AttributeItem",
                        "separator": "none",
                        "fontSize": "medium",
                        "italic": false,
                        "bold": false,
                        "constant": false
                      }
                    ],
                    "justify": "start",
                    "align": "center"
                  },
                  {
                    "width": "full",
                    "bordered": false,
                    "visibility": "both",
                    "content": "",
                    "contentSlotId": "",
                    "isContainer": true,
                    "className": "AttributeContainer",
                    "direction": "col",
                    "children": [
                      {
                        "width": "unset",
                        "bordered": false,
                        "visibility": "both",
                        "content": "CHA",
                        "contentSlotId": "",
                        "isContainer": false,
                        "className": "AttributeItem",
                        "separator": "none",
                        "fontSize": "medium",
                        "italic": false,
                        "bold": true,
                        "constant": true
                      },
                      {
                        "width": "unset",
                        "bordered": false,
                        "visibility": "both",
                        "content": "",
                        "contentSlotId": "010",
                        "isContainer": false,
                        "className": "AttributeItem",
                        "separator": "none",
                        "fontSize": "medium",
                        "italic": false,
                        "bold": false,
                        "constant": false
                      }
                    ],
                    "justify": "start",
                    "align": "center"
                  }
                ],
                "justify": "start",
                "align": "stretch"
              },
              {
                "width": "unset",
                "bordered": false,
                "visibility": "both",
                "content": "",
                "contentSlotId": "",
                "isContainer": false,
                "className": "AttributeItem",
                "separator": "medium",
                "fontSize": "medium",
                "italic": false,
                "bold": false,
                "constant": false
              },
              {
                "width": "full",
                "bordered": false,
                "visibility": "both",
                "content": "",
                "contentSlotId": "",
                "isContainer": true,
                "className": "AttributeContainer",
                "direction": "row",
                "children": [
                  {
                    "width": "unset",
                    "bordered": false,
                    "visibility": "both",
                    "content": "Senses",
                    "contentSlotId": "",
                    "isContainer": false,
                    "className": "AttributeItem",
                    "separator": "none",
                    "fontSize": "medium",
                    "italic": false,
                    "bold": true,
                    "constant": true
                  },
                  {
                    "width": "unset",
                    "bordered": false,
                    "visibility": "both",
                    "content": "",
                    "contentSlotId": "011",
                    "isContainer": false,
                    "className": "AttributeItem",
                    "separator": "none",
                    "fontSize": "medium",
                    "italic": false,
                    "bold": false,
                    "constant": false
                  }
                ],
                "justify": "start",
                "align": "stretch"
              },
              {
                "width": "full",
                "bordered": false,
                "visibility": "both",
                "content": "",
                "contentSlotId": "",
                "isContainer": true,
                "className": "AttributeContainer",
                "direction": "row",
                "children": [
                  {
                    "width": "unset",
                    "bordered": false,
                    "visibility": "both",
                    "content": "Languages",
                    "contentSlotId": "",
                    "isContainer": false,
                    "className": "AttributeItem",
                    "separator": "none",
                    "fontSize": "medium",
                    "italic": false,
                    "bold": true,
                    "constant": true
                  },
                  {
                    "width": "unset",
                    "bordered": false,
                    "visibility": "both",
                    "content": "",
                    "contentSlotId": "012",
                    "isContainer": false,
                    "className": "AttributeItem",
                    "separator": "none",
                    "fontSize": "medium",
                    "italic": false,
                    "bold": false,
                    "constant": false
                  }
                ],
                "justify": "start",
                "align": "stretch"
              },
              {
                "width": "full",
                "bordered": false,
                "visibility": "both",
                "content": "",
                "contentSlotId": "",
                "isContainer": true,
                "className": "AttributeContainer",
                "direction": "row",
                "children": [
                  {
                    "width": "unset",
                    "bordered": false,
                    "visibility": "both",
                    "content": "Challenge",
                    "contentSlotId": "",
                    "isContainer": false,
                    "className": "AttributeItem",
                    "separator": "none",
                    "fontSize": "medium",
                    "italic": false,
                    "bold": true,
                    "constant": true
                  },
                  {
                    "width": "unset",
                    "bordered": false,
                    "visibility": "both",
                    "content": "",
                    "contentSlotId": "013",
                    "isContainer": false,
                    "className": "AttributeItem",
                    "separator": "none",
                    "fontSize": "medium",
                    "italic": false,
                    "bold": false,
                    "constant": false
                  }
                ],
                "justify": "start",
                "align": "stretch"
              },
              {
                "width": "unset",
                "bordered": false,
                "visibility": "both",
                "content": "",
                "contentSlotId": "",
                "isContainer": false,
                "className": "AttributeItem",
                "separator": "medium",
                "fontSize": "medium",
                "italic": false,
                "bold": false,
                "constant": false
              }
            ],
            "justify": "start",
            "align": "stretch"
          }
        ]
      },
      "contentTemplate": "",
      "relatedElements": []
    },
    "Example Category": {
      "className": "Category",
      "uniqueName": "Example Category",
      "attributeTableTemplate": {
        "className": "AttributeTable",
        "float": "right",
        "children": [
          {
            "width": "unset",
            "bordered": false,
            "visibility": "both",
            "content": "",
            "contentSlotId": "",
            "isContainer": true,
            "className": "AttributeContainer",
            "direction": "col",
            "children": [
              {
                "width": "unset",
                "bordered": false,
                "visibility": "both",
                "content": "",
                "contentSlotId": "72de2edf-cbf4-4790-b15d-70632a40f14b",
                "isContainer": false,
                "className": "AttributeItem",
                "separator": "none",
                "fontSize": "large",
                "italic": false,
                "bold": true,
                "constant": false
              },
              {
                "width": "unset",
                "bordered": false,
                "visibility": "both",
                "content": "",
                "contentSlotId": "46c4c4c2-854e-4dcb-91f2-f864bf32f6ae",
                "isContainer": false,
                "className": "AttributeItem",
                "separator": "none",
                "fontSize": "small",
                "italic": true,
                "bold": false,
                "constant": false
              },
              {
                "width": "unset",
                "bordered": false,
                "visibility": "both",
                "content": "",
                "contentSlotId": "07652bbd-f469-4667-9919-94a7caffb4c4",
                "isContainer": false,
                "className": "AttributeItem",
                "separator": "medium",
                "fontSize": "medium",
                "italic": false,
                "bold": false,
                "constant": false
              },
              {
                "width": "max",
                "bordered": false,
                "visibility": "both",
                "content": "",
                "contentSlotId": "",
                "isContainer": true,
                "className": "AttributeContainer",
                "direction": "row",
                "children": [
                  {
                    "width": "unset",
                    "bordered": false,
                    "visibility": "both",
                    "content": "Contant1",
                    "contentSlotId": "31eb89db-ae3a-4c9c-9f69-8fb8270bf20e",
                    "isContainer": false,
                    "className": "AttributeItem",
                    "separator": "none",
                    "fontSize": "medium",
                    "italic": false,
                    "bold": false,
                    "constant": true
                  },
                  {
                    "width": "unset",
                    "bordered": false,
                    "visibility": "both",
                    "content": "Contant3",
                    "contentSlotId": "13b666f3-66a7-4b3b-9347-a01eac852d17",
                    "isContainer": false,
                    "className": "AttributeItem",
                    "separator": "none",
                    "fontSize": "medium",
                    "italic": false,
                    "bold": false,
                    "constant": true
                  }
                ],
                "justify": "start",
                "align": "stretch"
              },
              {
                "width": "max",
                "bordered": false,
                "visibility": "both",
                "content": "",
                "contentSlotId": "",
                "isContainer": true,
                "className": "AttributeContainer",
                "direction": "row",
                "children": [
                  {
                    "width": "unset",
                    "bordered": false,
                    "visibility": "both",
                    "content": "Contant3",
                    "contentSlotId": "cb9b8531-dbb1-4132-bc80-f1874f6d1796",
                    "isContainer": false,
                    "className": "AttributeItem",
                    "separator": "none",
                    "fontSize": "medium",
                    "italic": false,
                    "bold": false,
                    "constant": true
                  },
                  {
                    "width": "unset",
                    "bordered": false,
                    "visibility": "both",
                    "content": "Variable with default content",
                    "contentSlotId": "cb314556-134a-41a3-a8aa-cec065dadf1b",
                    "isContainer": false,
                    "className": "AttributeItem",
                    "separator": "none",
                    "fontSize": "small",
                    "italic": true,
                    "bold": true,
                    "constant": false
                  }
                ],
                "justify": "start",
                "align": "stretch"
              },
              {
                "width": "unset",
                "bordered": false,
                "visibility": "both",
                "content": "",
                "contentSlotId": "94b7a825-291e-4860-b66a-024aa09fa865",
                "isContainer": false,
                "className": "AttributeItem",
                "separator": "medium",
                "fontSize": "medium",
                "italic": false,
                "bold": false,
                "constant": false
              },
              {
                "width": "full",
                "bordered": false,
                "visibility": "both",
                "content": "",
                "contentSlotId": "539e9e34-7b71-43ea-8a01-2e4e949847a4",
                "isContainer": false,
                "className": "AttributeItem",
                "separator": "none",
                "fontSize": "medium",
                "italic": false,
                "bold": false,
                "constant": false
              }
            ],
            "justify": "start",
            "align": "stretch"
          }
        ]
      },
      "contentTemplate": "This string of text was defined as the 'Template Text' of the [[Example Category]]. It will be displayed on every note of this category.\nOn the right of this text you can see a table, the style and layout of which were also defined in the [[Example Category]]. Some cells of the table have variable content and can be edited inside of notes belonging to this category, the content of other cells is defined inside of the category and the same between all notes.",
      "relatedElements": [
        "Categories Tutorial"
      ]
    }
  },
  "activeViewIndex": 0,
  "version": 1
}

export const defaultProject: SerializableProject = SerializableProject.deserialize(JSON.stringify(defaultProjectJson))



