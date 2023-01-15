import {Priority} from './Priority';
import {Category} from './Category';

export class Task {
    id: number;
    title: string;
    url_name: string;
    completed: number;
    priority: Priority;
    category: Category;
    date?: Date;


    oldCategory: Category;


    constructor(id: number, title: string, completed: number,url_name: string, priority: Priority, category: Category, oldCategory?: Category, date?: Date) {
        this.id = id;
        this.title = title;
        this.completed = completed;
        this.priority = priority;
        this.url_name=url_name;
        this.category = category;
        this.oldCategory = oldCategory;
        this.date = date;
    }
}
