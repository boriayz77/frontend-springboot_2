import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';



export class CommonService<T> {

  private readonly url: string;

  constructor(url: string,
              private httpClient: HttpClient
  ) {
    this.url = url;
  }

  add(t: T): Observable<T> {
    return this.httpClient.post<T>(this.url + '/add', t);
  }

  delete(id: number): Observable<T> {
    return this.httpClient.delete<T>(this.url + '/delete/' + id);
  }

  findById(id: number): Observable<T> {
    return this.httpClient.get<T>(this.url + '/id/' + id);
  }

  findAll(): Observable<T[]> {
    return this.httpClient.get<T[]>(this.url + '/all');
  }

  update(t: T): Observable<T> {
    return this.httpClient.put<T>(this.url + '/update', t);
  }


}
