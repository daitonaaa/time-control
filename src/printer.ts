import { TimePeriod } from './time-period';
import moment from 'moment';

export class Printer {
  printList(list: TimePeriod[]): void {
    const results = list.map(period => ({
      id: period.id,
      'Наименование': period.text,
      'Время начала': moment(period.timestamp).format('HH:mm'),
    }));

    console.table(results);
  }
}
