import JSZip from "jszip";
import { FileName } from "./fileName.model";

export class Vault {
  name: string;
  /** Maps file name to file content */
  files: Map<string, string>;

  constructor(
    name: string,
    files: Map<string, string> = new Map(),
  ) {
    this.name = name
    this.files = files;
  }

  /** 
   * Takes a zip archive and returns a promise on a new Vault instance representing the archive
   * @param {File} file The .zip archive to generate a Vault from
   * @returns {Promise<Vault>} Promise on the newly constructed vault
   */
  static async fromZip(file: File): Promise<Vault> {
    const zip = await JSZip.loadAsync(file);
    console.log(file.type);
    const new_files: Map<string, string> = new Map();
    zip.forEach((filename: string) => {
      if (!filename.endsWith('/')) {
        const file_name = new FileName(filename);
        const f = zip.files[filename];
        new_files.set(file_name.toString(), '');
        f.async('text').then((text) => {
          new_files.set(file_name.toString(), text);
        });
      }
    })
    console.log(new_files)
    return new Vault(file.name, new_files)
  }

  async toZip(): Promise<File> {
    return new File([], '')
  }
}