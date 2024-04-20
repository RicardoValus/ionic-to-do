import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CapacitorSQLite, JsonSQLite } from '@capacitor-community/sqlite';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  public dbReady: BehaviorSubject<boolean>
  public isWeb: boolean;
  public isIOS: boolean;
  public dbName: string;

  constructor(
    private http: HttpClient
  ) {
    this.dbReady = new BehaviorSubject(false);
    this.isWeb = false;
    this.isIOS = false;
    this.dbName = '';
  }

  async init() {
    const info = await Device.getInfo();
    const sqlite = CapacitorSQLite as any;

    if (info.platform == 'android') {
      try {
        await sqlite.requestPermission();
      } catch (error) {
        console.error("Este aplicativo precisa de permissões para funcionar")
      }
    } else if (info.platform == 'web') {
      this.isWeb = true;
      await sqlite.initWebStore();
    } else if (info.platform == 'ios') {
      this.isIOS = true;
    }

    this.setupDatebase();
  }


  async setupDatebase() {
    const dbSetup = await Preferences.get({ key: 'first_setup_key' })

    if (!dbSetup.value) {
      this.downloadDatabase();
    } else {
      this.dbName = await this.getDbName()
      await CapacitorSQLite.createConnection({ database: this.dbName });
      await CapacitorSQLite.open({ database: this.dbName })
      this.dbReady.next(true);
    }
  }

  downloadDatabase() {
    this.http.get('assets/db/db.json').subscribe(
      async (jsonExport: JsonSQLite) => {
        const jsonstring = JSON.stringify(jsonExport);
        const isValid = await CapacitorSQLite.isJsonValid({ jsonstring });

        if (isValid.result) {
          this.dbName = jsonExport.database;
          await CapacitorSQLite.importFromJson({ jsonstring });
          await CapacitorSQLite.createConnection({ database: this.dbName });
          await CapacitorSQLite.open({ database: this.dbName })

          await Preferences.set({ key: 'first_setup_key', value: '1' })
          await Preferences.set({ key: 'dbname', value: this.dbName })

          this.dbReady.next(true);
        }

      })
  }

  async getDbName() {
    if (!this.dbName) {
      const dbName = await Preferences.get({ key: 'dbname' })
      if (dbName.value) {
        this.dbName = dbName.value
      }
    }
    return this.dbName;
  }

}
