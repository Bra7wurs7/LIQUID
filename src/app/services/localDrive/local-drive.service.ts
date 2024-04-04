import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { MessageService } from 'primeng/api';
import { Project, SerializableProject } from 'src/app/models/project.model';
import JSZip from 'jszip';
import { Article } from 'src/app/models/article.model';
import { Vault } from 'src/app/models/vault.model';

@Injectable({
  providedIn: 'root'
})
export class LocalDriveService {

  constructor(private messageService: MessageService) {

  }

  saveToLocalDrive(fileName: string, project: string) {
    let LIQUIDPrjct = new Blob([project], { type: 'LIQUID Project' })
    FileSaver.saveAs(LIQUIDPrjct, fileName);
  }

  vaultToZip() {
  }

  async zipToVault(file: File): Promise<Project> {
    const zip = await JSZip.loadAsync(file);
    const new_files: Map<string, Article> = new Map();
    zip.forEach((filename: string) => {
      if (!filename.endsWith('/')) {
        if (filename.endsWith('.md')) {
          const filename_typeless = filename.substring(0,filename.length-3)
          const category_names = filename_typeless.split("#").map((n) => n.trim()).reverse();
          const primary_filename = category_names.pop();
          const f = zip.files[filename];
          const new_article = new Article(filename_typeless, category_names);
          new_files.set(filename_typeless, new_article);
          f.async('text').then((text) => {
            new_article.content = text;
          });
        }
      }
    })
    console.log(new_files)
    return new Project(file.name, new_files)
  }

  loadFromLocalDrive(file: File): Promise<SerializableProject> {
    return new Promise<SerializableProject>((resolve, reject) => {
      if (!file) {
        this.messageService.add({ severity: 'warn', summary: 'No file provided' })
        reject()
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const text = reader.result?.toString() ?? undefined;
        if (!text) {
          this.messageService.add({ severity: 'error', summary: 'Could not read file content (if any)' })
          reject()
        } else {
          resolve(SerializableProject.deserialize(text));
        }
      };
      reader.readAsText(file);
    });
  }

}
