import {Task} from '../../../model/Task';
import {CommonDAO} from './CommonDAO';
import {Observable} from 'rxjs';
import {TaskSearchValues} from "../search/SearchObjects";

export interface TaskDAO extends CommonDAO<Task> {

    // поиск  по любым параметрам из TaskSearchValues
    findTasks(taskSearchValues: TaskSearchValues): Observable<any>;


}
