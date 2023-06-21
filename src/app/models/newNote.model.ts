import { serializable } from "../helper/serialize.helper";

@serializable
export class Note {
    readonly className: string = 'Note';

    /** The name of the note as well as its unique identifier */
    private uniqueName: string;
    /** The entire note in liquid-markdown Format */
    private content: string;
    
    /** may or may not belong to one or more categories */
    private categories: string[];
    /** object of key value pairs, representing the note's JSON attributes */
    private attributes: Record<string, any>;



    constructor(
        uniqueName: string = '',
        categories?: string[],
        attributesMap: Record<string, any> = {},
        content: string = '',
    ) {
        this.uniqueName = uniqueName;
        this.categories = categories ?? [];
        this.attributes = attributesMap;
        this.content = content;
    }
}
