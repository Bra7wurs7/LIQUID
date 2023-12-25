import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { MessageService } from 'primeng/api';
import { SerializableProject } from 'src/app/models/project.model';

@Injectable({
  providedIn: 'root'
})
export class LocalDriveService {

  constructor(private messageService: MessageService) {

  }

  saveToLocalDrive(fileName: string, project: string) {
    let LIQUIDPrjct = new Blob([project], {type: 'LIQUID Project'})
    FileSaver.saveAs(LIQUIDPrjct, fileName);
  }
  loadFromLocalDrive(file: File): Promise<SerializableProject> {
    return new Promise<SerializableProject>((resolve, reject) => {
      if (!file) {
        this.messageService.add({severity: 'warn', summary: 'No file provided'})
        reject()
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const text = reader.result?.toString() ?? undefined;
        if(!text) {
          this.messageService.add({severity: 'error', summary: 'Could not read file content (if any)'})
          reject()
        } else {
          resolve(SerializableProject.deserialize(text));
        }
      };
      reader.readAsText(file);
    });
  }

}
