//Este serviço é para Local Storage

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  taskCollection: any[] = [];
  key = 'taskCollecion';

  constructor() { }

  save(task: any, callback: (() => void) | null = null) {
    task.done = false

    //obter dado do localStorage

    let value = localStorage.getItem(this.key);

    if (value == null || value == undefined) {
      this.taskCollection.push(task);
      localStorage.setItem(this.key, JSON.stringify(this.taskCollection));
    } else {
      let collection: any[] = JSON.parse(value);
      collection.push(task);
      localStorage.setItem(this.key, JSON.stringify(collection));
    }

    if (callback != null) {
      callback();
    }
  }

  list() {
    //obter do localstorage
    let value = localStorage.getItem(this.key);
    if (value == null || value == undefined) {
      return [];
    }
    let collection: any[] = JSON.parse(value);
    return collection;
  }

  delete(task: any, callback: (() => void) | null = null) {
    let value = localStorage.getItem(this.key);
    if (value == null || value == undefined) {
      return;
    }
    let collection: any[] = JSON.parse(value);

    let resultCollection = collection.filter(item => { return item.task != task.task });

    localStorage.setItem(this.key, JSON.stringify(resultCollection));

    if (callback != null) {
      callback();
    }
  }

  update(task: any, callback: (() => void) | null = null) {
    let value = localStorage.getItem(this.key);

    if (value == null || value == undefined) {
      return;
    } else {
      let collection: any[] = JSON.parse(value);

      collection.forEach(item => {
        if (item.task == task.task) {
          item.done = task.done;
        }
      });
      localStorage.setItem(this.key, JSON.stringify(collection));
    }
    if (callback != null) {
      callback();
    }
  }
} 