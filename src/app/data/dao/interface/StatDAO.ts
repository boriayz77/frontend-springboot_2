import {Observable} from 'rxjs';
import {Stat} from "../../../model/Stat";

// общая статистика
export interface StatDAO {

    getOverallStat(): Observable<Stat>;

}
