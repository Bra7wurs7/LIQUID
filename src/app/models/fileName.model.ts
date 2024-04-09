export class FileName {
    name: string = '';
    parents: string[] = [];
    file_type: FileType = FileType.unknown;

    constructor(filename: string) {
        // Create copy of filename to mutate
        let filename_copy = '' + filename;
        if (filename_copy.endsWith(FileType.markdown)) {
            this.file_type = FileType.markdown;
        } else if (filename_copy.endsWith(FileType.json)) {
            this.file_type = FileType.json;
        }
        filename_copy = filename_copy.substring(0, filename_copy.length - this.file_type.length);

        const split_by_hash = filename_copy.split("#").map((s) => s.trim());
        this.name = split_by_hash[0];

        this.parents = split_by_hash.filter((s) => s !== this.name).sort()
    }

    toString(): string {
        return this.name + this.parents.join(" #") + this.file_type;
    }
}

export enum FileType {
    unknown = '',
    json = '.json',
    markdown = '.md'
  }