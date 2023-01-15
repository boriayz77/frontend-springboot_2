import {Component, Inject, OnInit} from '@angular/core';
import {Task} from '../../model/Task';
import {Priority} from '../../model/Priority';
import {Category} from '../../model/Category';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {DeviceDetectorService} from 'ngx-device-detector';
import {DialogAction, DialogResult} from '../../object/DialogResult';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.css']
})

// редактирование/создание задачи
export class EditTaskDialogComponent implements OnInit {

  constructor(
      private dialogRef: MatDialogRef<EditTaskDialogComponent>, // // для возможности работы с текущим диалог. окном
      @Inject(MAT_DIALOG_DATA) private data: [Task, string, Category[], Priority[]], // данные, которые передаем в текущее диалоговое окно
      private dialog: MatDialog, // для открытия нового диалогового окна (из текущего) - например для подтверждения удаления
      private deviceService: DeviceDetectorService // определение устройства пользователя
  ) {
  }

  // коллекции получаем из главной страницы (через параметры диалог. окна), чтобы здесь заново не делать запрос в БД
  categories: Category[];
  priorities: Priority[];

  // мобильное ли устройство
  isMobile = this.deviceService.isMobile();

  dialogTitle: string;
  task: Task;


  newTitle: string;
  newUrl_name: string;
  newPriorityId: number;
  newCategoryId: number;
  newDate: Date;

  oldCategoryId: number;


  canDelete = true;
  canComplete = true;

  today = new Date();


  ngOnInit() {
    this.task = this.data[0]; // задача для редактирования/создания
    this.dialogTitle = this.data[1]; // текст для диалогового окна
    this.categories = this.data[2]; // категории для выпадающего списка
    this.priorities = this.data[3]; // приоритеты для выпадающего списка

    if (this.task && this.task.id > 0) {
      this.canDelete = true;
      this.canComplete = true;
    }


    this.newTitle = this.task.title;

    if (this.task.priority) {
      this.newPriorityId = this.task.priority.id;
    }

    if (this.task.category) {
      this.newCategoryId = this.task.category.id;
      this.oldCategoryId = this.task.category.id;
    }

    if (this.task.date) {

      this.newDate = new Date(this.task.date);
    }
    if (this.task.date) {

      this.newDate = new Date(this.task.date);
    }
    if (this.task.url_name) {

      this.newUrl_name = this.task.url_name;
    }

  }

  // нажали ОК
  confirm(): void {

    // считываем все значения для сохранения в поля задачи
    this.task.title = this.newTitle;
    this.task.priority = this.findPriorityById(this.newPriorityId);
    this.task.category = this.findCategoryById(this.newCategoryId);
    this.task.oldCategory = this.findCategoryById(this.oldCategoryId);

    if (!this.newDate) {
      this.task.date = null;
    } else {

      this.task.date = this.newDate;
    }
      this.task.url_name=this.newUrl_name;


    this.dialogRef.close(new DialogResult(DialogAction.SAVE, this.task));

  }

  // нажали отмену (ничего не сохраняем и закрываем окно)
  cancel(): void {
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }

  // нажали Удалить
  delete() {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Подтвердите действие',
        message: `Вы действительно хотите удалить задачу: "${this.task.title}"?`
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {

      if (!(result)) { // если просто закрыли окно, ничего не нажав
        return;
      }


      if (result.action === DialogAction.OK) {
        this.dialogRef.close(new DialogResult(DialogAction.DELETE)); // нажали удалить
      }
    });
  }

  // нажали Выполнить (завершить) задачу
  complete() {
    this.dialogRef.close(new DialogResult(DialogAction.COMPLETE));

  }

  // делаем статус задачи "незавершенным" (активируем)
  activate() {
    this.dialogRef.close(new DialogResult(DialogAction.ACTIVATE));
  }


  // поиск приоритета по id
  private findPriorityById(tmpPriorityId: number): Priority {
    return this.priorities.find(t => t.id === tmpPriorityId);
  }

  // поиск категории по id
  private findCategoryById(tmpCategoryId: number): Category {
    return this.categories.find(t => t.id === tmpCategoryId);
  }

  // установка даты + кол-во дней
  addDays(days: number) {
    this.newDate = new Date();
    this.newDate.setDate(this.today.getDate() + days);
  }

  // установка даты "сегодня"
  setToday() {
    this.newDate = this.today;
  }

}
