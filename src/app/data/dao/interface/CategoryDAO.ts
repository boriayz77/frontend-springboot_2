import {Category} from '../../../model/Category';
import {CommonDAO} from './CommonDAO';
import {Observable} from 'rxjs';
import {CategorySearchValues} from "../search/SearchObjects";

// специфичные методы для работы с категориями
export interface CategoryDAO extends CommonDAO<Category> {

    // поиск категорий по любым параметрам
    findCategories(categorySearchValues: CategorySearchValues): Observable<any>;

}
