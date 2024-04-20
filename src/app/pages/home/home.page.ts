import { Component } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { RepositoryService } from 'src/app/services/repository.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  taskCollection: any[] = [];

  constructor(
    private alertCtrl: AlertController,
    private repositoryService: RepositoryService,
    private actionSheetCtrl: ActionSheetController
  ) { }

  ionViewDidEnter() {
    this.listTask();
  }

  listTask() {
    this.taskCollection = this.repositoryService.list();
  }

  async showAdd() {
    const alert = await this.alertCtrl.create({
      header: 'Informe o afazer',
      inputs: [
        {
          name: 'task',
          type: 'text',
          placeholder: 'Descreva seu afazer'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        }, {
          text: 'Adicionar',
          handler: (task) => {
            console.log(task);
            this.repositoryService.save(task, () => {
              this.listTask();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  delete(item: any) {
    this.repositoryService.delete(item, () => {
      this.listTask();
    })
  }

  async openActions(task: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "Alterar para:",
      buttons: [
        {
          text: task.done ? 'Pendente' : 'Realizado',
          icon: task.done ? 'close-outline' : 'checkmark-circle',
          handler: () => {
            task.done = !task.done;

            this.repositoryService.update(task, () => {
              this.listTask();
            })
          }
        }
      ]
    });

    await actionSheet.present();
  }

  // ----------- Local Storage /\-------------------------- Sqlite \/ ----------------------------------------------

   





}
