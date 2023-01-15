
import {Inject, Injectable, InjectionToken} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from './CommonService';
import {Category} from "../../../model/Category";
import {CategoryDAO} from "../interface/CategoryDAO";
import {CategorySearchValues} from "../search/SearchObjects";
export const CATEGORY_URL_TOKEN = new InjectionToken<string>('url');
@Injectable({
  providedIn: 'root'
})
export class CategoryService extends CommonService<Category> implements CategoryDAO {

  constructor(@Inject(CATEGORY_URL_TOKEN) private baseUrl,
              private http: HttpClient
  ) {
    super(baseUrl, http);
  }


  findCategories(categorySearchValues: CategorySearchValues) {
    return this.http.post<Category[]>(this.baseUrl + '/search', categorySearchValues);
  }


}
