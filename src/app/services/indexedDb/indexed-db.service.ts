import { Injectable } from '@angular/core';
import { openDB, deleteDB, wrap, unwrap, IDBPDatabase } from 'idb';
import { SerializableProject } from 'src/app/models/project.model';
import { DBProject } from './DBProject';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  dbName = 'GAS';
  objectStoreName = 'PROJECTS'
  dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = openDB(this.dbName, 1, {
      upgrade: (upgradeDb) => {
        if(!upgradeDb.objectStoreNames.contains(this.objectStoreName)) {
          upgradeDb.createObjectStore(this.objectStoreName, {keyPath: 'title'});
        }
      }
    });
  }

  async getAllProjects(): Promise<{title: string, lastModified: Date}[]> {
    const db = (await this.dbPromise);
    const tx = db.transaction([this.objectStoreName], 'readonly');
    const store = tx.objectStore(this.objectStoreName);
    return (await store.getAll()).map((project: DBProject) => {return {title: project.title, lastModified: project.lastModified}})
  }

  async saveProject(title: string, projectJSON: string): Promise<void> {
    const db = (await this.dbPromise);
    const tx = db.transaction([this.objectStoreName], 'readwrite');
    const store = tx.objectStore(this.objectStoreName);
    const existingProject = await store.get(title);
    if(existingProject) {
      store.put({title: title, projectJSON: projectJSON, lastModified: new Date()})
    } else {
      store.add({title: title, projectJSON: projectJSON, lastModified: new Date()})
    }
    return tx.done;
  }

  async loadProject(title: string): Promise<DBProject> {
    const db = (await this.dbPromise);
    const tx = db.transaction([this.objectStoreName], 'readonly');
    const store = tx.objectStore(this.objectStoreName);
    return store.get(title);
  }

  async deleteProject(title: string): Promise<void> {
    const db = (await this.dbPromise);
    const tx = db.transaction([this.objectStoreName], 'readwrite');
    const store = tx.objectStore(this.objectStoreName);
    store.delete(title);
    return tx.done;
  }
}
