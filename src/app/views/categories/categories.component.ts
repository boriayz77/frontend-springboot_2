import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Category} from '../../model/Category';
import {DeviceDetectorService} from 'ngx-device-detector';
import {MatDialog} from '@angular/material/dialog';
import {CategorySearchValues} from "../../data/dao/search/SearchObjects";
import {EditCategoryDialogComponent} from "../../dialog/edit-category-dialog/edit-category-dialog.component";
import {DialogAction} from "../../object/DialogResult";

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

    @Input('selectedCategory')
    set setCategory(selectedCategory: Category) {
        this.selectedCategory = selectedCategory;
    }

    @Input('categories')
    set setCategories(categories: Category[]) {
        this.categories = categories; // категории для отображения
    }

    @Input('categorySearchValues')
    set setCategorySearchValues(categorySearchValues: CategorySearchValues) {
        this.categorySearchValues = categorySearchValues;
    }

    // используется для категории Все
    @Input('uncompletedCountForCategoryAll')
    set uncompletedCount(uncompletedCountForCategoryAll: number) {
        this.uncompletedCountForCategoryAll = uncompletedCountForCategoryAll;
    }


    // выбрали категорию из списка
    @Output()
    selectCategory = new EventEmitter<Category>();

    // удалили категорию
    @Output()
    deleteCategory = new EventEmitter<Category>();

    // изменили категорию
    @Output()
    updateCategory = new EventEmitter<Category>();

    // добавили категорию
    @Output()
    addCategory = new EventEmitter<Category>(); // передаем только название новой категории

    // поиск категории
    @Output()
    searchCategory = new EventEmitter<CategorySearchValues>(); // передаем строку для поиска



    selectedCategory;
    indexMouseMove: number;
    showEditIconCategory: boolean;

    isMobile: boolean;
    categories: Category[];

    categorySearchValues: CategorySearchValues;

    uncompletedCountForCategoryAll: number;

    filterTitle: string;

    filterChanged: boolean;

    constructor(
        private dialog: MatDialog,
        private deviceService: DeviceDetectorService
    ) {
        this.isMobile = deviceService.isMobile();
    }

    ngOnInit() {
    }
    search() {

        this.filterChanged = false;

        if (!this.categorySearchValues) {
            return;
        }

        this.categorySearchValues.title = this.filterTitle;
        this.searchCategory.emit(this.categorySearchValues);

    }

    showCategory(category: Category) {

        if (this.selectedCategory === category) {
            return;
        }

        this.selectedCategory = category;
        this.selectCategory.emit(this.selectedCategory);
    }


    showEditIcon(show: boolean, index: number) {
        this.indexMouseMove = index;
        this.showEditIconCategory = show;
    }


    clearAndSearch() {
        this.filterTitle = null;
        this.search();
    }
    checkFilterChanged() {

        this.filterChanged = false;

        if (this.filterTitle !== this.categorySearchValues.title){
            this.filterChanged = true;
        }

        return this.filterChanged;

    }

    openAddDialog() {

        const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
            data: [new Category(null, ''), 'Добавление категории'],
            width: '400px'
        });

        dialogRef.afterClosed().subscribe(result => {

            if (!(result)) {
                return;
            }

            if (result.action === DialogAction.SAVE) {
                this.addCategory.emit(result.obj as Category);
            }
        });
    }


    // диалоговое окно для редактирования категории
    openEditDialog(category: Category) {
        const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
            // передаем копию объекта, чтобы все изменения не касались оригинала (чтобы их можно было отменить)
            data: [new Category(category.id, category.title), 'Редактирование категории'], width: '400px'
        });

        dialogRef.afterClosed().subscribe(result => {

            if (!(result)) { // если просто закрыли окно, ничего не нажав
                return;
            }

            if (result.action === DialogAction.DELETE) { // нажали удалить
                this.deleteCategory.emit(category); // вызываем внешний обработчик
                return;
            }

            if (result.action === DialogAction.SAVE) { // нажали сохранить (обрабатывает как добавление, так и удаление)

                this.updateCategory.emit(result.obj as Category); // вызываем внешний обработчик
                return;
            }
        });
    }
}
