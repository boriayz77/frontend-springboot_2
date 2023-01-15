import {Component, OnInit} from '@angular/core';
import {Priority} from '../../model/Priority';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogAction, DialogResult} from '../../object/DialogResult';
import {PriorityService} from "../../data/dao/impl/PriorityService";

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css']
})

// диалоговое окно настроек приложения
export class SettingsDialogComponent implements OnInit {

  priorities: Priority[]; // список приоритетов для редактирования/удаления
  settingsChanged = false; // были ли изменены настройки

  constructor(
    private dialogRef: MatDialogRef<SettingsDialogComponent>, // для возможности работы с текущим диалог. окном
    private priorityService: PriorityService // ссылка на сервис для работы с данными
  ) {
  }


  ngOnInit() {
    this.priorityService.findAll().subscribe(priorities => this.priorities = priorities);
  }

  // нажали Закрыть
  close(): void {

    if (this.settingsChanged) {
      this.dialogRef.close(new DialogResult(DialogAction.SETTINGS_CHANGE, this.priorities));
    } else {
      this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
    }
  }


  // добавили приоритет
  addPriority(priority: Priority): void {
    this.settingsChanged = true;
    this.priorityService.add(priority).subscribe(result => {
      this.priorities.push(result);
    });
  }

  // удалили приоритет
  deletePriority(priority: Priority): void {

    this.settingsChanged = true; // в настройках произошли изменения
    this.priorityService.delete(priority.id).subscribe(() => {
        this.priorities.splice(this.getPriorityIndex(priority), 1);
      }
    );
  }
  updatePriority(priority: Priority): void {
    this.settingsChanged = true;
    this.priorityService.update(priority).subscribe(() => {
        this.priorities[this.getPriorityIndex(priority)] = priority;
      }
    )
    ;
  }
  getPriorityIndex(priority: Priority): number {
    const tmpPriority = this.priorities.find(t => t.id === priority.id);
    return this.priorities.indexOf(tmpPriority);
  }

}
