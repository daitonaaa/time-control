import { TimePeriod } from './time-period';
import { getJSONAllDays, getJSONFile, saveJSONDayFile } from './utils/json';
import { TimePeriodList } from './model';

export class DataManager {
  async save(period: TimePeriod): Promise<void> {
    const curPeriods = await getJSONFile(new Date());
    curPeriods.push(period);
    await saveJSONDayFile(new Date(), curPeriods);
  }

  getDayData(): Promise<TimePeriod[]> {
    return getJSONFile(new Date());
  }

  getList(): Promise<TimePeriodList> {
    return getJSONAllDays();
  }
}
